export interface Hit {
  term: string;
  start?: number;
  end?: number;
  severity: number;
  source: "rules" | "llm" | string;
}

export type HitCensor = {
  term: string;
  start?: number;
  end?: number;
  severity: number;
  source: "rules" | "llm" | string;
};
