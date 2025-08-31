import { LogEntry, ModerationResult } from "@/lib/types";
import { apiService } from "./api-service";

class ModerationService {
  private endpoint = "/moderate";

  async checkText(
    text: string,
    useLLM: boolean = false
  ): Promise<ModerationResult> {
    return apiService.post<ModerationResult>(this.endpoint, { text, useLLM });
  }

  async getLogs(): Promise<LogEntry[]> {
    return apiService.get<LogEntry[]>("/logs");
  }

  async censorText(text: string, useLLM: boolean = false): Promise<string> {
    const result = await this.checkText(text, useLLM);

    if (!result.containsProfanity) {
      return text;
    }

    let censoredText = text;

    const sortedHits = [...result.hits]
      .filter((hit) => hit.start !== undefined && hit.end !== undefined)
      .sort((a, b) => (b.start || 0) - (a.start || 0));

    for (const hit of sortedHits) {
      if (hit.start !== undefined && hit.end !== undefined) {
        const replacement = "*".repeat(hit.end - hit.start);
        censoredText =
          censoredText.substring(0, hit.start) +
          replacement +
          censoredText.substring(hit.end);
      }
    }

    return censoredText;
  }
}

export const moderationService = new ModerationService();
