import React from "react";
import { Word } from "@/lib/types";
import { wordService } from "@/common/services";
import Link from "next/link";

interface WordManagementProps {
  words: Word[];
  setWords: (words: Word[]) => void;
  newWord: { term: string; list: string; severity: number };
  setNewWord: (newWord: {
    term: string;
    list: string;
    severity: number;
  }) => void;
  editingWord: Word | null;
  setEditingWord: (word: Word | null) => void;
}

export const WordManagement = ({
  words,
  setWords,
  newWord,
  setNewWord,
  editingWord,
  setEditingWord,
}: WordManagementProps) => {
  const fetchWords = async () => {
    try {
      const data = await wordService.getAllWords();
      setWords(data);
    } catch (error) {
      console.error("Error fetching words:", error);
    }
  };

  const addWord = async () => {
    if (!newWord.term.trim()) return;

    try {
      await wordService.addWord({
        term: newWord.term,
        list: newWord.list as "BLACK" | "WHITE",
        severity: newWord.severity,
      });
      setNewWord({ term: "", list: "BLACK", severity: 1 });
      fetchWords();
    } catch (error) {
      console.error("Error adding word:", error);
    }
  };

  const deleteWord = async (id: number) => {
    try {
      await wordService.deleteWord(id);
      fetchWords();
    } catch (error) {
      console.error("Error deleting word:", error);
    }
  };

  const startEdit = (word: Word) => {
    setEditingWord({
      id: word.id,
      term: word.term,
      list: word.list,
      severity: word.severity,
      normalizedTerm: word.normalizedTerm,
      createdAt: word.createdAt,
      updatedAt: word.updatedAt,
    });
  };

  const updateWord = async () => {
    if (!editingWord) return;

    try {
      await wordService.updateWord(editingWord.id!, {
        term: editingWord.term,
        list: editingWord.list,
        severity: editingWord.severity,
      });
      setEditingWord(null);
      fetchWords();
    } catch (error) {
      console.error("Error updating word:", error);
    }
  };

  const cancelEdit = () => {
    setEditingWord(null);
  };

  const getSeverityColor = (severity: number) => {
    switch (severity) {
      case 1:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30";
      case 2:
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30";
      case 3:
        return "bg-red-100 text-red-800 dark:bg-red-900/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="bg-card rounded-xl shadow-md border border-border/40 p-7 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2.5 bg-secondary/10 rounded-lg text-secondary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
            <path d="m15 5 3 3" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-foreground">Manage Words</h2>
      </div>
      <p className="text-base text-muted-foreground mb-5">
        Add, edit, or remove words from your custom filter list
      </p>

      {/* Add new word form */}
      <div className="mb-7 p-5 border border-border/40 rounded-lg bg-accent shadow-sm">
        <h3 className="text-base font-medium mb-4 text-foreground">
          Add New Word
        </h3>
        <div className="space-y-4">
          <input
            type="text"
            value={newWord.term}
            onChange={(e) => setNewWord({ ...newWord, term: e.target.value })}
            placeholder="Word or phrase"
            className="w-full p-3.5 border border-border/60 bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary/40 transition-all shadow-sm"
            aria-label="New word term"
          />
          <div className="grid grid-cols-2 gap-4">
            <select
              value={newWord.list}
              onChange={(e) =>
                setNewWord({
                  ...newWord,
                  list: e.target.value as "BLACK" | "WHITE",
                })
              }
              className="p-3.5 border border-border/60 bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary/40 transition-all shadow-sm"
              aria-label="Word list type"
              title="Select list type"
            >
              <option value="BLACK">Blacklist</option>
              <option value="WHITE">Whitelist</option>
            </select>
            <select
              value={newWord.severity}
              onChange={(e) =>
                setNewWord({
                  ...newWord,
                  severity: parseInt(e.target.value),
                })
              }
              className="p-3.5 border border-border/60 bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary/40 transition-all shadow-sm"
              aria-label="Word severity"
              title="Select severity level"
            >
              <option value="1">Severity: 1</option>
              <option value="2">Severity: 2</option>
              <option value="3">Severity: 3</option>
            </select>
          </div>
          <button
            onClick={addWord}
            className="w-full bg-gradient-to-r from-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary/80 text-secondary-foreground font-medium py-3 px-5 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add Word
          </button>
        </div>
      </div>

      {/* Word list */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">Filtered Words</h3>
          {words.length > 5 && (
            <Link
              href="/words"
              className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              <span>See all words ({words.length})</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Link>
          )}
        </div>
        
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="bg-muted px-4 py-2.5 border-b border-border flex justify-between items-center">
            <h3 className="text-sm font-medium">Word List</h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>{words.length} words</span>
            </div>
          </div>
          <div className="overflow-auto max-h-[320px]">
            {words.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                <p>No words added yet</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Term
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      List
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Severity
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {words.slice(0, 5).map((word) => (
                    <tr
                      key={word.id}
                      className="hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-4 py-3">
                        {editingWord && editingWord.id === word.id ? (
                          <input
                            type="text"
                            value={editingWord.term}
                            onChange={(e) =>
                              setEditingWord({
                                ...editingWord,
                                term: e.target.value,
                              })
                            }
                            className="w-full p-1.5 border border-border bg-background rounded focus:outline-none focus:ring-1 focus:ring-secondary/20 transition-all"
                            aria-label="Edit word term"
                            title="Edit word term"
                          />
                        ) : (
                          <span className="font-medium">{word.term}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {editingWord && editingWord.id === word.id ? (
                          <select
                            value={editingWord.list}
                            onChange={(e) =>
                              setEditingWord({
                                ...editingWord,
                                list: e.target.value as "BLACK" | "WHITE",
                              })
                            }
                            className="w-full p-1.5 border border-border bg-background rounded focus:outline-none focus:ring-1 focus:ring-secondary/20 transition-all"
                            aria-label="Edit word list type"
                            title="Edit list type"
                          >
                            <option value="BLACK">Blacklist</option>
                            <option value="WHITE">Whitelist</option>
                          </select>
                        ) : (
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${
                              word.list === "BLACK"
                                ? "bg-gradient-to-r from-rose-500/30 to-pink-500/30 border border-rose-300 dark:border-rose-700 shadow-sm"
                                : "bg-gradient-to-r from-emerald-500/30 to-teal-500/30 border border-emerald-300 dark:border-emerald-700 shadow-sm"
                            }`}
                          >
                            {word.list === "BLACK" ? "BLACKLIST" : "WHITELIST"}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {editingWord && editingWord.id === word.id ? (
                          <select
                            value={editingWord.severity}
                            onChange={(e) =>
                              setEditingWord({
                                ...editingWord,
                                severity: parseInt(e.target.value),
                              })
                            }
                            className="w-full p-1.5 border border-border bg-background rounded focus:outline-none focus:ring-1 focus:ring-secondary/20 transition-all"
                            aria-label="Edit word severity"
                            title="Edit severity level"
                          >
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                          </select>
                        ) : (
                          <span
                            className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold ${getSeverityColor(
                              word.severity
                            )} shadow-sm border border-opacity-30 border-current`}
                          >
                            {word.severity}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {editingWord && editingWord.id === word.id ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={updateWord}
                              className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded transition-colors"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="bg-muted hover:bg-muted/80 text-muted-foreground text-xs px-2 py-1 rounded transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => startEdit(word)}
                              className="bg-secondary/10 hover:bg-secondary/20 text-secondary text-xs px-2.5 py-1 rounded-md transition-colors flex items-center gap-1.5"
                              title="Edit word"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                <path d="m15 5 4 4" />
                              </svg>
                              Edit
                            </button>
                            <button
                              onClick={() => deleteWord(word.id!)}
                              className="bg-destructive/10 hover:bg-destructive/20 text-destructive text-xs px-2.5 py-1 rounded-md transition-colors flex items-center gap-1.5"
                              title="Delete word"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M3 6h18" />
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                <line x1="10" x2="10" y1="11" y2="17" />
                                <line x1="14" x2="14" y1="11" y2="17" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
