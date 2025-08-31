import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { normalize } from "@/lib/normalize";

const prisma = new PrismaClient();

// GET /api/words -> lista todas las palabras
export async function GET() {
  const words = await prisma.word.findMany();
  return NextResponse.json(words);
}

// POST /api/words -> crea una palabra
export async function POST(req: NextRequest) {
  const { term, list, severity } = await req.json();

  if (!term || !list) {
    return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
  }

  const word = await prisma.word.create({
    data: {
      term,
      normalizedTerm: normalize(term),
      list,
      severity: severity ?? 1,
    },
  });

  return NextResponse.json(word, { status: 201 });
}
