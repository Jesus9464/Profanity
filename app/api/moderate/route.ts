import { NextRequest, NextResponse } from "next/server";
import { normalize } from "@/lib/normalize";
import { checkWithLLM } from "@/lib/ollama";
import { Hit } from "@/lib/types";
import { prisma } from "@/lib/prisma";

// Lista predeterminada de palabras prohibidas normalizadas
// Estas palabras serán detectadas incluso si no están en la base de datos
const DEFAULT_BLACKLIST = [
  // Inglés - Nivel alto (severity 3)
  { term: "motherfucker", normalizedTerm: "motherfucker", severity: 3 },
  { term: "cunt", normalizedTerm: "cunt", severity: 3 },
  { term: "nigger", normalizedTerm: "nigger", severity: 3 },
  { term: "nigga", normalizedTerm: "nigga", severity: 3 },
  { term: "faggot", normalizedTerm: "faggot", severity: 3 },
  { term: "fag", normalizedTerm: "fag", severity: 3 },
  
  // Inglés - Nivel medio (severity 2)
  { term: "fuck", normalizedTerm: "fuck", severity: 2 },
  { term: "fucker", normalizedTerm: "fucker", severity: 2 },
  { term: "shit", normalizedTerm: "shit", severity: 2 },
  { term: "asshole", normalizedTerm: "asshole", severity: 2 },
  { term: "bitch", normalizedTerm: "bitch", severity: 2 },
  { term: "pussy", normalizedTerm: "pussy", severity: 2 },
  { term: "whore", normalizedTerm: "whore", severity: 2 },
  { term: "slut", normalizedTerm: "slut", severity: 2 },
  { term: "cock", normalizedTerm: "cock", severity: 2 },
  { term: "retard", normalizedTerm: "retard", severity: 2 },
  
  // Inglés - Nivel bajo (severity 1)
  { term: "ass", normalizedTerm: "ass", severity: 1 },
  { term: "bastard", normalizedTerm: "bastard", severity: 1 },
  { term: "damn", normalizedTerm: "damn", severity: 1 },
  { term: "piss", normalizedTerm: "piss", severity: 1 },
  { term: "dick", normalizedTerm: "dick", severity: 1 },
  
  // Español - Nivel alto (severity 3)
  { term: "puta", normalizedTerm: "puta", severity: 2 },
  { term: "puto", normalizedTerm: "puto", severity: 2 },
  { term: "cabrón", normalizedTerm: "cabron", severity: 2 },
  
  // Español - Nivel medio (severity 2)
  { term: "mierda", normalizedTerm: "mierda", severity: 2 },
  { term: "joder", normalizedTerm: "joder", severity: 2 },
  { term: "coño", normalizedTerm: "cono", severity: 2 },
  { term: "pendejo", normalizedTerm: "pendejo", severity: 2 },
  { term: "verga", normalizedTerm: "verga", severity: 2 },
  { term: "polla", normalizedTerm: "polla", severity: 2 },
  { term: "chinga", normalizedTerm: "chinga", severity: 2 },
  
  // Palabras en español adicionales
  { term: "maricón", normalizedTerm: "maricon", severity: 3 },
  { term: "marica", normalizedTerm: "marica", severity: 3 },
  { term: "pinga", normalizedTerm: "pinga", severity: 2 },
  { term: "carajo", normalizedTerm: "carajo", severity: 2 },
  { term: "chingada", normalizedTerm: "chingada", severity: 2 },
  { term: "culero", normalizedTerm: "culero", severity: 2 },
  { term: "gilipollas", normalizedTerm: "gilipollas", severity: 2 },
  { term: "capullo", normalizedTerm: "capullo", severity: 2 },
  { term: "hijueputa", normalizedTerm: "hijueputa", severity: 3 },
  { term: "gonorrea", normalizedTerm: "gonorrea", severity: 2 },
];

export async function POST(req: NextRequest) {
  const { text, useLLM = false } = await req.json();

  const words = await prisma.word.findMany();
  const blacklist = words.filter((w) => w.list === "BLACK");
  const whitelist = new Set(
    words.filter((w) => w.list === "WHITE").map((w) => w.normalizedTerm)
  );

  const ntext = normalize(text);
  let hits: Hit[] = [];

  // Combinar la lista de palabras de la base de datos con la lista predeterminada
  const combinedBlacklist = [...blacklist, ...DEFAULT_BLACKLIST];
  
  // Verificar si el texto normalizado contiene alguna palabra prohibida
  for (const w of combinedBlacklist) {
    if (ntext.includes(w.normalizedTerm) && !whitelist.has(w.normalizedTerm)) {
      hits.push({ term: w.term, severity: w.severity, source: "rules" });
    }
  }

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

  try {
    await prisma.log.create({
      data: {
        text,
        usedLLM: useLLM,
        contains: containsProfanity,
        severity,
        hits: JSON.parse(JSON.stringify(hits)),
      },
    });
  } catch (error) {
    console.error("Failed to log to database:", error);
  }

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
