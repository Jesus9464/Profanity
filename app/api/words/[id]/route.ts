import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { normalize } from "@/lib/normalize";

const prisma = new PrismaClient();

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await prisma.word.delete({
    where: { id: Number(id) },
  });

  return NextResponse.json({ success: true });
}
