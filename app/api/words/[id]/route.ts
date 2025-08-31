import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { normalize } from "@/lib/normalize";

const prisma = new PrismaClient();

// PUT /api/words/:id -> actualizar palabra
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { term, list, severity } = await req.json();

  const updated = await prisma.word.update({
    where: { id: Number(id) },
    data: {
      ...(term && { term, normalizedTerm: normalize(term) }),
      ...(list && { list }),
      ...(severity && { severity }),
    },
  });

  return NextResponse.json(updated);
}

// DELETE /api/words/:id -> eliminar palabra
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  await prisma.word.delete({
    where: { id: Number(id) },
  });

  return NextResponse.json({ success: true });
}
