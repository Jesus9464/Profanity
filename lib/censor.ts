import { Hit } from "@/lib/types";

// Reemplaza cada palabra detectada en el texto original por censura
export function censorText(text: string, hits: Hit[]): string {
  let censored = text;

  for (const hit of hits) {
    if (!hit.term) continue;

    const regex = new RegExp(hit.term, "gi"); // case insensitive
    const stars =
      hit.term[0] +
      "*".repeat(Math.max(hit.term.length - 2, 1)) +
      hit.term.slice(-1);

    censored = censored.replace(regex, stars);
  }

  return censored;
}
