import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, WordList } from "@prisma/client";
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

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    await prisma.word.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "No se pudo eliminar la palabra" },
      { status: 404 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const { term, list, severity } = await req.json();
  const updateData: {
    term?: string;
    normalizedTerm?: string;
    list?: WordList;
    severity?: number;
  } = {};

  if (term) {
    updateData.term = term;
    updateData.normalizedTerm = normalize(term);
  }

  if (list && (list === "BLACK" || list === "WHITE"))
    updateData.list = list as WordList;
  if (severity !== undefined) updateData.severity = severity;

  try {
    const updatedWord = await prisma.word.update({
      where: { id: Number(id) },
      data: updateData,
    });

    return NextResponse.json(updatedWord, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "No se pudo actualizar la palabra" },
      { status: 404 }
    );
  }
}
