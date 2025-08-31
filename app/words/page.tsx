"use client";

import { useState, useEffect } from "react";
import { Word } from "@/lib/types";
import { wordService } from "@/common/services";
import Link from "next/link";

export default function WordsPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingWord, setEditingWord] = useState<Word | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterList, setFilterList] = useState<string>("ALL");

  useEffect(() => {
    const fetchWords = async () => {
      try {
        setLoading(true);
        const data = await wordService.getAllWords();
        setWords(data);
      } catch (error) {
        console.error("Error fetching words:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWords();
  }, []);

  const filteredWords = words.filter((word) => {
    const matchesSearch = word.term.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesList = filterList === "ALL" || word.list === filterList;
    return matchesSearch && matchesList;
  });

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
      
      // Actualizar la lista de palabras
      const updatedWords = await wordService.getAllWords();
      setWords(updatedWords);
    } catch (error) {
      console.error("Error updating word:", error);
    }
  };

  const cancelEdit = () => {
    setEditingWord(null);
  };

  const deleteWord = async (id: number) => {
    try {
      await wordService.deleteWord(id);
      
      // Actualizar la lista de palabras
      const updatedWords = await wordService.getAllWords();
      setWords(updatedWords);
    } catch (error) {
      console.error("Error deleting word:", error);
    }
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
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-6 py-10 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
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
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold">Manage Words</h1>
          </div>
          <div className="text-sm text-muted-foreground">
            Complete word management and filtering system
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card rounded-lg border border-border p-6 flex items-center gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold">{words.length}</div>
              <div className="text-sm text-muted-foreground">Total Words</div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg border border-border p-6 flex items-center gap-4">
            <div className="bg-rose-500/10 text-rose-500 p-3 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <path d="m15 9-6 6" />
                <path d="m9 9 6 6" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {words.filter(w => w.list === "BLACK").length}
              </div>
              <div className="text-sm text-muted-foreground">Blacklisted Words</div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg border border-border p-6 flex items-center gap-4">
            <div className="bg-emerald-500/10 text-emerald-500 p-3 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {words.filter(w => w.list === "WHITE").length}
              </div>
              <div className="text-sm text-muted-foreground">Whitelisted Words</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
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
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                placeholder="Search words..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary/20"
              />
            </div>
          </div>
          <div>
            <select
              value={filterList}
              onChange={(e) => setFilterList(e.target.value)}
              className="w-full md:w-auto px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary/20"
              aria-label="Filter by list type"
              title="Filter by list type"
            >
              <option value="ALL">All Lists</option>
              <option value="BLACK">Blacklist</option>
              <option value="WHITE">Whitelist</option>
            </select>
          </div>
        </div>

        {/* Word list */}
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="bg-muted px-4 py-2.5 border-b border-border flex justify-between items-center">
            <h3 className="text-sm font-medium">All Words</h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>{filteredWords.length} words</span>
            </div>
          </div>
          <div className="overflow-auto">
            {loading ? (
              <div className="p-6 text-center text-muted-foreground">
                <p>Loading words...</p>
              </div>
            ) : filteredWords.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                <p>No words found</p>
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
                      Added Date
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {filteredWords.map((word) => (
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
                            {word.list === "BLACK"
                              ? "BLACKLIST"
                              : "WHITELIST"}
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
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {word.createdAt ? new Date(word.createdAt).toLocaleDateString() : 'N/A'}
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
}
