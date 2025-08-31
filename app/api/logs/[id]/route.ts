import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { censorText } from "@/lib/censor";
import { HitCensor } from "@/lib/types";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { searchParams } = new URL(req.url);
  const censored = searchParams.get("censored") !== "false";

  const log = await prisma.log.findUnique({
    where: { id: Number(context.params.id) },
  });

  if (!log) {
    return NextResponse.json({ error: "Log not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...log,
    text: censored
      ? censorText(log.text, (log.hits as HitCensor[]) || [])
      : log.text,
  });
}
