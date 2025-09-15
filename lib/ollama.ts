import { OllamaHit } from "./types";

const isLocal = true;

const API = isLocal
  ? "http://localhost:11434/api/generate"
  : "https://29e9ae00c246.ngrok-free.app/api/generate";

export async function checkWithLLM(text: string) {
  try {
    const resp = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "mistral",
        format: "json",
        prompt: `
You are a profanity detector for both English and Spanish. Analyze the following text and detect any offensive words, profanity, insults, or vulgar language.

Return ONLY a JSON with the following format:

{
  "hits": [
    { "term": "word", "start": 10, "end": 15, "severity": 2 }
  ]
}

Where:
- term: the offensive word or phrase found
- start: starting position in the text (0-based)
- end: ending position in the text
- severity: severity level (1: mild, 2: medium, 3: high)

IMPORTANT: Detect offensive words in both English and Spanish.

If there are no profanities:
{ "hits": [] }

Text:
${text}
    `,
      }),
    });

    const data = await resp.text();

    try {
      const lines = data.split("\n").filter((line) => line.trim());
      let responseContent = "";

      for (const line of lines) {
        try {
          const lineObj = JSON.parse(line);
          if (lineObj.response !== undefined) {
            responseContent += lineObj.response;
          }
          if (lineObj.done === true) {
          }
        } catch {}
      }

      const jsonStart = responseContent.indexOf("{");
      const jsonEnd = responseContent.lastIndexOf("}");

      if (jsonStart === -1 || jsonEnd === -1) {
        return [];
      }

      const jsonStr = responseContent.slice(jsonStart, jsonEnd + 1);

      const parsed = JSON.parse(jsonStr);

      if (!parsed.hits || !Array.isArray(parsed.hits)) {
        return [];
      }

      const validatedHits = parsed.hits.map((hit: OllamaHit) => ({
        term: hit.term || "",
        start: typeof hit.start === "number" ? hit.start : undefined,
        end: typeof hit.end === "number" ? hit.end : undefined,
        severity: typeof hit.severity === "number" ? hit.severity : 1,
      }));

      return validatedHits;
    } catch (parseError) {
      console.error("Error parsing Ollama JSON response:", parseError);
      return [];
    }
  } catch (err) {
    console.error("Error calling Ollama:", err);
    return [];
  }
}
