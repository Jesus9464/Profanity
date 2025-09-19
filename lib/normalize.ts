/**
 * Character substitution map for common obfuscation techniques
 * Maps obfuscated characters to their likely intended characters
 */
const CHAR_SUBSTITUTIONS: Record<string, string> = {
  // Number substitutions
  '0': 'o',
  '1': 'i',
  '2': 'z',
  '3': 'e',
  '4': 'a',
  '5': 's',
  '6': 'g',
  '7': 't',
  '8': 'b',
  '9': 'g',
  
  // Letter substitutions
  '$': 's',
  '@': 'a',
  '+': 't',
  '!': 'i',
  '*': 'a',
  '(': 'c',
  ')': 'o',
  '[': 'c',
  ']': 'o',
  '{': 'c',
  '}': 'o',
  '|': 'i',
  '/': 'i',
  '\\': 'i',
  '<': 'c',
  '>': 'o',
  '^': 'a',
  '&': 'a',
  '%': 'o',
  '#': 'h',
  '=': 'e',
};

/**
 * Patrones de palabras comunes ofuscadas
 * Estos patrones se aplican antes de las sustituciones de caracteres individuales
 */
const WORD_PATTERNS: [RegExp, string][] = [
  // Variaciones de "fuck"
  [/f+[vu\*]+c+k+/gi, 'fuck'],
  [/ph+[vu\*]+c*k+/gi, 'fuck'],
  [/f+[vu\*]+k+/gi, 'fuck'],
  
  // Variaciones de "fucker"
  [/f+[vu\*]+c*k+[e3]r+/gi, 'fucker'],
  [/f+[vu\*]+k+[e3]r+/gi, 'fucker'],
  
  // Variaciones de "motherfucker"
  [/m+[o0]+t+h+[e3]+r+f+[vu\*]+c*k+[e3]r+/gi, 'motherfucker'],
  [/m+[o0]+t+h+[e3]+r+f+[vu\*]+k+[e3]r+/gi, 'motherfucker'],
  
  // Variaciones de "shit"
  [/sh+[i!1]+t+/gi, 'shit'],
  [/sh+[i!1]+[t7]+/gi, 'shit'],
  
  // Variaciones de "bitch"
  [/b+[i!1]+t+c*h+/gi, 'bitch'],
  [/b+[i!1]+[t7]+c*h+/gi, 'bitch'],
  
  // Variaciones de "asshole"
  [/a+[s\$]+[s\$]+h+[o0]+l+[e3]+/gi, 'asshole'],
  
  // Variaciones de "cunt"
  [/c+[vu]+n+t+/gi, 'cunt'],
  [/k+[vu]+n+t+/gi, 'cunt'],
  
  // Variaciones de "dick"
  [/d+[i!1]+c*k+/gi, 'dick'],
  
  // Variaciones de "pussy"
  [/p+[vu]+[s\$]+[s\$]+[yi!1]+/gi, 'pussy'],
  
  // Variaciones de "ass"
  [/a+[s\$]+[s\$]+/gi, 'ass'],
  
  // Variaciones de "whore"
  [/w+h+[o0]+r+[e3]+/gi, 'whore'],
  
  // Variaciones de "slut"
  [/s+l+[vu]+t+/gi, 'slut'],
  
  // Variaciones de "bastard"
  [/b+a+[s\$]+t+a+r+d+/gi, 'bastard'],
  
  // Variaciones de "damn"
  [/d+a+m+n+/gi, 'damn'],
  
  // Variaciones de "piss"
  [/p+[i!1]+[s\$]+[s\$]+/gi, 'piss'],
  
  // Variaciones de "cock"
  [/c+[o0]+c*k+/gi, 'cock'],
  
  // Variaciones de "nigger/nigga"
  [/n+[i!1]+g+[e3]*r+/gi, 'nigger'],
  [/n+[i!1]+g+[a4]+/gi, 'nigga'],
  
  // Variaciones de "faggot/fag"
  [/f+a+g+[o0]*t*/gi, 'faggot'],
  [/f+a+g+/gi, 'fag'],
  
  // Variaciones de "retard"
  [/r+[e3]+t+a+r+d+/gi, 'retard'],
];

/**
 * Escapes special characters in a string for use in a RegExp
 * @param string - The string to escape
 * @returns The escaped string
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

/**
 * Normalizes text to detect profanity even when obfuscated
 * 
 * @param text - The input text to normalize
 * @returns Normalized text with obfuscation techniques handled
 */
export function normalize(text: string): string {
  // First perform basic normalization
  let normalized = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // Remove diacritics
  
  // First pass: apply specific word patterns for common obfuscated profanity
  for (const [pattern, replacement] of WORD_PATTERNS) {
    normalized = normalized.replace(pattern, replacement);
  }
  
  // Second pass: replace special characters and numbers with potential letter equivalents
  for (const [obfuscated, replacement] of Object.entries(CHAR_SUBSTITUTIONS)) {
    // Escape the obfuscated character if it's a special RegExp character
    const escapedObfuscated = escapeRegExp(obfuscated);
    normalized = normalized.replace(new RegExp(escapedObfuscated, 'g'), replacement);
  }
  
  // Third pass: remove all remaining non-alphanumeric characters
  normalized = normalized.replace(/[^a-z0-9]/g, "");
  
  // Handle repeated characters that might be used to bypass filters (like 'fuuuuck')
  normalized = normalized.replace(/([a-z])\1{2,}/g, '$1');
  
  return normalized;
}
