import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { normalize } from "@/lib/normalize";
import { checkWithLLM } from "@/lib/ollama";
import { Hit } from "@/lib/types";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { text, useLLM = false } = await req.json();

  const words = await prisma.word.findMany();
  const blacklist = words.filter((w) => w.list === "BLACK");
  const whitelist = new Set(
    words.filter((w) => w.list === "WHITE").map((w) => w.normalizedTerm)
  );

  const ntext = normalize(text);
  let hits: Hit[] = [];

  // reglas locales
  for (const w of blacklist) {
    if (ntext.includes(w.normalizedTerm) && !whitelist.has(w.normalizedTerm)) {
      hits.push({ term: w.term, severity: w.severity, source: "rules" });
    }
  }

  // Ollama (si aplica)
  if (useLLM) {
    const llmHits = await checkWithLLM(text);
    const mappedHits: Hit[] = llmHits.map(
      (h: {
        term: string;
        start?: number;
        end?: number;
        severity: number;
      }) => ({
        term: h.term,
        start: h.start || undefined,
        end: h.end || undefined,
        severity: h.severity || 1,
        source: "llm",
      })
    );
    hits = [...hits, ...mappedHits];
  }

  const severity = hits.reduce((m, h) => Math.max(m, h.severity ?? 0), 0);
  const containsProfanity = hits.length > 0;

  await prisma.log.create({
    data: {
      text,
      usedLLM: useLLM,
      contains: containsProfanity,
      severity,
      hits: JSON.parse(JSON.stringify(hits)),
    },
  });

  return NextResponse.json({
    containsProfanity,
    severity,
    hits: hits.map((hit) => ({
      term: hit.term,
      start: hit.start,
      end: hit.end,
      severity: hit.severity,
      ...(hit.source && { source: hit.source }),
    })),
    usedLLM: useLLM,
  });
}
