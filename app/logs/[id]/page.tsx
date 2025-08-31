"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { moderationService } from "@/common/services/index";
import { LogEntry, Hit } from "@/lib/types";

export default function LogDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [log, setLog] = useState<LogEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOriginal, setShowOriginal] = useState(false);

  useEffect(() => {
    const fetchLog = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await moderationService.getLogById(
          parseInt(params.id),
          showOriginal
        );
        setLog(data);
      } catch (error) {
        console.error("Error fetching log:", error);
        setError("Error loading log data. The log might not exist.");
      } finally {
        setLoading(false);
      }
    };

    fetchLog();
  }, [params.id, showOriginal]);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Link
                href="/logs"
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
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-2xl font-bold">Log Details</h1>
            </div>
            <button
              onClick={() => setShowOriginal(!showOriginal)}
              className={`px-3 py-1.5 text-sm rounded-md border ${
                showOriginal
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-foreground border-border"
              }`}
            >
              {showOriginal ? "Show Censored" : "Show Original"}
            </button>
          </div>

          {/* Content */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-2 text-muted-foreground">Loading log data...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 mb-4">
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
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
                <p className="text-lg font-medium">{error}</p>
                <Link
                  href="/logs"
                  className="mt-4 inline-block text-primary hover:underline"
                >
                  Return to logs
                </Link>
              </div>
            ) : log ? (
              <div className="divide-y divide-border">
                {/* Log Header */}
                <div className="p-6 bg-muted/5">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="bg-muted/20 text-foreground px-3 py-1.5 rounded-md text-sm font-medium">
                        Log #{log.id}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {formatDateTime(log.createdAt)}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {log.contains && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-500">
                          Profanity
                        </span>
                      )}
                      {log.usedLLM && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500">
                          LLM
                        </span>
                      )}
                      {log.severity > 0 && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500">
                          Severity: {log.severity}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Log Content */}
                <div className="p-6">
                  <div className="mb-6">
                    <h2 className="text-sm font-medium text-muted-foreground mb-2">
                      Text Content
                    </h2>
                    <div className="p-4 rounded-md bg-muted/10 border border-border">
                      <p className="text-base whitespace-pre-wrap break-words">
                        {log.text}
                      </p>
                    </div>
                  </div>

                  {/* Hits */}
                  {log.hits && log.hits.length > 0 && (
                    <div>
                      <h2 className="text-sm font-medium text-muted-foreground mb-2">
                        Detected Terms ({log.hits.length})
                      </h2>
                      <div className="bg-muted/5 rounded-md border border-border p-4">
                        <div className="space-y-3">
                          {log.hits.map((hit: Hit, index: number) => (
                            <div
                              key={index}
                              className="flex flex-wrap items-center gap-3 p-3 bg-card rounded-md border border-border"
                            >
                              <div className="flex-1">
                                <div className="font-medium">{hit.term}</div>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {hit.severity !== undefined && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-rose-500/10 text-rose-500">
                                      Severity: {hit.severity}
                                    </span>
                                  )}
                                  {hit.source && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-500/10 text-blue-500">
                                      Source: {hit.source}
                                    </span>
                                  )}
                                  {hit.start !== undefined &&
                                    hit.end !== undefined && (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-emerald-500/10 text-emerald-500">
                                        Position: {hit.start}-{hit.end}
                                      </span>
                                    )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <p>No log data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
