"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { moderationService } from "@/common/services/index";
import { LogEntry, Hit } from "@/lib/types";

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOriginal, setShowOriginal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [filterLLM, setFilterLLM] = useState<string>("all");
  const [filterProfanity, setFilterProfanity] = useState<string>("all");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const data = await moderationService.getLogs(!showOriginal);
        setLogs(data);
      } catch (error) {
        console.error("Error fetching logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [showOriginal]);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = log.text
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDate = selectedDate
      ? new Date(log.createdAt).toLocaleDateString() ===
        new Date(selectedDate).toLocaleDateString()
      : true;
    const matchesLLM =
      filterLLM === "all"
        ? true
        : filterLLM === "yes"
        ? log.usedLLM
        : !log.usedLLM;
    const matchesProfanity =
      filterProfanity === "all"
        ? true
        : filterProfanity === "yes"
        ? log.contains
        : !log.contains;
    return matchesSearch && matchesDate && matchesLLM && matchesProfanity;
  });

  const uniqueDates = [
    ...new Set(logs.map((log) => new Date(log.createdAt).toLocaleDateString())),
  ].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-6 py-10 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
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
            <h1 className="text-2xl font-bold">System Logs</h1>
          </div>
          <div className="text-sm text-muted-foreground">
            View and analyze system activity logs
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="bg-card rounded-lg border border-border p-4 flex items-center gap-3 flex-1 min-w-[180px]">
            <div className="bg-blue-500/10 text-blue-500 p-2 rounded-md">
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
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                <path d="M12 11h4"></path>
                <path d="M12 16h4"></path>
                <path d="M8 11h.01"></path>
                <path d="M8 16h.01"></path>
              </svg>
            </div>
            <div>
              <div className="text-xl font-bold">{logs.length}</div>
              <div className="text-xs text-muted-foreground">Total Logs</div>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-4 flex items-center gap-3 flex-1 min-w-[180px]">
            <div className="bg-rose-500/10 text-rose-500 p-2 rounded-md">
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
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <div>
              <div className="text-xl font-bold">
                {logs.filter((log) => log.hits && log.hits.length > 0).length}
              </div>
              <div className="text-xs text-muted-foreground">
                Flagged Entries
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-4 flex items-center gap-3 flex-1 min-w-[180px]">
            <div className="bg-emerald-500/10 text-emerald-500 p-2 rounded-md">
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
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <div>
              <div className="text-xl font-bold">{uniqueDates.length}</div>
              <div className="text-xs text-muted-foreground">Unique Days</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="p-4 border-b border-border bg-muted/5">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative w-full max-w-xs">
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
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </svg>
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 bg-card p-3 rounded-lg border border-border">
            <div className="flex items-center gap-2 mr-2">
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
                className="text-muted-foreground"
              >
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
              </svg>
              <span className="text-sm font-medium">Filters:</span>
            </div>

            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary/20"
              aria-label="Filter by date"
              title="Filter by date"
            >
              <option value="">All Dates</option>
              {uniqueDates.map((date) => (
                <option key={date} value={date}>
                  {date}
                </option>
              ))}
            </select>

            <select
              value={filterLLM}
              onChange={(e) => setFilterLLM(e.target.value)}
              className="px-3 py-1.5 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary/20"
              aria-label="Filter by LLM usage"
              title="Filter by LLM usage"
            >
              <option value="all">All LLM</option>
              <option value="yes">Used LLM</option>
              <option value="no">No LLM</option>
            </select>

            <select
              value={filterProfanity}
              onChange={(e) => setFilterProfanity(e.target.value)}
              className="px-3 py-1.5 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary/20"
              aria-label="Filter by profanity"
              title="Filter by profanity"
            >
              <option value="all">All Content</option>
              <option value="yes">Contains Profanity</option>
              <option value="no">Clean Content</option>
            </select>

            <button
              onClick={() => setShowOriginal(!showOriginal)}
              className={`px-3 py-1.5 text-sm rounded-md border ${
                showOriginal
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-foreground border-border"
              }`}
            >
              {showOriginal ? "Show Original" : "Show Censored"}
            </button>
          </div>
        </div>

        {/* Logs list */}
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="bg-muted px-4 py-2.5 border-b border-border flex justify-between items-center">
            <h3 className="text-sm font-medium">System Logs</h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>{filteredLogs.length} entries</span>
            </div>
          </div>
          <div>
            {loading ? (
              <div className="p-6 text-center text-muted-foreground">
                <p>Loading logs...</p>
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                <p>No logs found</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 border-b border-border last:border-b-0 hover:bg-muted/5 transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/logs/${log.id}`}
                          className="bg-muted/20 text-foreground px-2 py-1 rounded text-xs font-medium hover:bg-muted/30 transition-colors"
                        >
                          #{log.id}
                        </Link>
                        <span className="text-xs text-muted-foreground">
                          {formatDateTime(log.createdAt)}
                        </span>
                      </div>
                      <div className="flex gap-1.5">
                        {log.contains && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-500">
                            Profanity
                          </span>
                        )}
                        {log.usedLLM && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500">
                            LLM
                          </span>
                        )}
                        {log.severity > 0 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500">
                            Severity: {log.severity}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mb-3 relative">
                      <p className="text-sm whitespace-pre-wrap break-words p-3 rounded-md bg-card border border-border">
                        {log.text.length > 150
                          ? `${log.text.substring(0, 150)}...`
                          : log.text}
                      </p>
                      <Link
                        href={`/logs/${log.id}`}
                        className="absolute right-2 bottom-2 p-1.5 rounded-full bg-muted/10 hover:bg-muted/20 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                        title="View details"
                      >
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
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          <polyline points="15 3 21 3 21 9"></polyline>
                          <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                      </Link>
                    </div>

                    {log.hits && log.hits.length > 0 && (
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-1.5">
                          {log.hits.map((hit: Hit, index: number) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded text-xs bg-rose-500/5 text-rose-500 border border-rose-200/50 dark:border-rose-800/50"
                            >
                              <span className="font-medium">{hit.term}</span>
                              {hit.severity && (
                                <span className="ml-1 bg-rose-500/10 px-1 rounded">
                                  {hit.severity}
                                </span>
                              )}
                              {hit.source && (
                                <span className="ml-1 text-[10px] text-muted-foreground">
                                  {hit.source}
                                </span>
                              )}
                              {hit.start !== undefined &&
                                hit.end !== undefined && (
                                  <span className="ml-1 text-[10px] text-muted-foreground">
                                    {hit.start}-{hit.end}
                                  </span>
                                )}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
