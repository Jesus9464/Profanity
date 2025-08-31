"use client";

import { useState, useEffect } from "react";
import { ModerationResult, Word } from "@/lib/types";
import { wordService } from "@/common/services";
import { Header } from "@/components/Header";
import { TextValidation } from "@/components/TextValidation";
import { WordManagement } from "@/components/WordManagement";

export default function Home() {
  const [text, setText] = useState("");
  const [useLLM, setUseLLM] = useState(false);
  const [result, setResult] = useState<ModerationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const [words, setWords] = useState<Word[]>([]);
  const [newWord, setNewWord] = useState({
    term: "",
    list: "BLACK",
    severity: 1,
  });
  const [editingWord, setEditingWord] = useState<Word | null>(null);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const data = await wordService.getAllWords();
        setWords(data);
      } catch (error) {
        console.error("Error fetching words:", error);
      }
    };

    fetchWords();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-6 py-10 max-w-7xl">
        <Header />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <TextValidation
            text={text}
            setText={setText}
            useLLM={useLLM}
            setUseLLM={setUseLLM}
            result={result}
            setResult={setResult}
            loading={loading}
            setLoading={setLoading}
          />
          <WordManagement
            words={words}
            setWords={setWords}
            newWord={newWord}
            setNewWord={setNewWord}
            editingWord={editingWord}
            setEditingWord={setEditingWord}
          />
        </div>
      </div>
    </div>
  );
}
