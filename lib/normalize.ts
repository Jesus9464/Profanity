export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD") // quita acentos
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, ""); // deja solo letras y números
}
