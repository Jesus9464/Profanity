export interface Hit {
  term: string;
  start?: number;
  end?: number;
  severity?: number;
  source: "rules" | "llm" | string;
}

export type HitCensor = {
  term: string;
  start?: number;
  end?: number;
  severity?: number;
  source: "rules" | "llm" | string;
};

export interface OllamaHit {
  term?: string;
  start?: number;
  end?: number;
  severity?: number;
}

export interface ModerationResult {
  containsProfanity: boolean;
  severity: number;
  hits: Hit[];
  usedLLM: boolean;
}

export interface LogEntry {
  id: number;
  text: string;
  usedLLM: boolean;
  contains: boolean;
  severity: number;
  hits: Hit[];
  createdAt: string;
}

export interface Word {
  id?: number;
  term: string;
  normalizedTerm?: string;
  list: "BLACK" | "WHITE";
  severity: number;
  createdAt?: Date;
  updatedAt?: Date;
}
