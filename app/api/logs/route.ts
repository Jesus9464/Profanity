import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { censorText } from "@/lib/censor";
import { HitCensor } from "@/lib/types";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const censored = searchParams.get("censored") !== "false";

  const logs = await prisma.log.findMany({
    orderBy: { createdAt: "desc" },
  });

  const result = logs.map((log) => ({
    ...log,
    text: censored
      ? censorText(log.text, (log.hits as HitCensor[]) || [])
      : log.text,
  }));

  return NextResponse.json(result);
}
