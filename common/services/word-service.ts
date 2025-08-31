import { Word } from "@/lib/types";
import { apiService } from "./api-service";

class WordService {
  private endpoint = "/words";

  async getAllWords(): Promise<Word[]> {
    return apiService.get<Word[]>(this.endpoint);
  }

  async getBlacklistedWords(): Promise<Word[]> {
    const words = await this.getAllWords();
    return words.filter((word) => word.list === "BLACK");
  }

  async getWhitelistedWords(): Promise<Word[]> {
    const words = await this.getAllWords();
    return words.filter((word) => word.list === "WHITE");
  }

  async addWord(
    word: Omit<Word, "id" | "createdAt" | "updatedAt" | "normalizedTerm">
  ): Promise<Word> {
    return apiService.post<Word>(this.endpoint, word);
  }

  async deleteWord(id: number): Promise<void> {
    return apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  async updateWord(id: number, word: Partial<Word>): Promise<Word> {
    return apiService.put<Word>(`${this.endpoint}/${id}`, word);
  }
}

export const wordService = new WordService();
