import { OllamaHit } from "./types";

export async function checkWithLLM(text: string) {
  try {
    const resp = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "mistral",
        prompt: `
Analiza el siguiente texto y detecta si contiene groserías o lenguaje ofensivo.
Responde SOLO en JSON válido con esta forma:

{
  "hits": [
    { "term": "palabra", "start": 10, "end": 15, "severity": 2 }
  ]
}

Si no hay groserías, responde:
{ "hits": [] }

Texto:
${text}
        `,
      }),
    });

    const data = await resp.text();
    console.log("Raw Ollama response:", data);

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

      console.log("Reconstructed response content:", responseContent);
      const jsonStart = responseContent.indexOf("{");
      const jsonEnd = responseContent.lastIndexOf("}");

      if (jsonStart === -1 || jsonEnd === -1) {
        console.error("No valid JSON found in response");
        return [];
      }

      const jsonStr = responseContent.slice(jsonStart, jsonEnd + 1);
      console.log("Extracted JSON:", jsonStr);

      const parsed = JSON.parse(jsonStr);

      if (!parsed.hits || !Array.isArray(parsed.hits)) {
        console.log("No hits array found in response");
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
    console.error("Error llamando a Ollama:", err);
    return [];
  }
}
