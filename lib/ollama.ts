export async function checkWithLLM(text: string) {
  try {
    const resp = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "mistral", // también puedes usar llama3, gemma, etc.
        prompt: `
Detecta groserías en este texto y responde SOLO en JSON válido:
{"hits":[{"term":"...","start":0,"end":4,"severity":2}]}

Texto:
${text}
        `,
      }),
    });

    const data = await resp.text();

    // 🛠️ Ollama responde en streaming, por eso a veces llega texto extra.
    // Aquí buscamos el último JSON en la respuesta.
    const jsonStart = data.lastIndexOf("{");
    if (jsonStart === -1) return [];

    const parsed = JSON.parse(data.slice(jsonStart));
    return parsed.hits ?? [];
  } catch (err) {
    console.error("Error llamando a Ollama:", err);
    return [];
  }
}
