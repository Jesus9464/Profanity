import React from "react";
import { ModerationResult } from "@/lib/types";
import { moderationService } from "@/common/services";

interface TextValidationProps {
  text: string;
  setText: (text: string) => void;
  useLLM: boolean;
  setUseLLM: (useLLM: boolean) => void;
  result: ModerationResult | null;
  setResult: (result: ModerationResult | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const TextValidation = ({
  text,
  setText,
  useLLM,
  setUseLLM,
  result,
  setResult,
  loading,
  setLoading,
}: TextValidationProps) => {
  const validateText = async () => {
    if (!text.trim()) return;

    setLoading(true);
    try {
      const data = await moderationService.checkText(text, useLLM);
      setResult(data);
    } catch (error) {
      console.error("Error validating text:", error);
    } finally {
      setLoading(false);
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
    <div className="bg-card rounded-xl shadow-md border border-border/40 p-7 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
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
            <path d="M14 4h6v6" />
            <path d="m10 4-2 2m-3 3-2 2" />
            <path d="M5 10H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1" />
            <path d="m17 11 3-3" />
            <path d="M12 12a2 2 0 0 1 2-2c.6 0 1.2.3 1.6.8L20 15v6h-6l-4.4-4.4c-.5-.4-.8-1-.8-1.6a2 2 0 0 1 2-2h1Z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-foreground">
          Validate Text
        </h2>
      </div>
      <p className="text-base text-muted-foreground mb-5">
        Check your content for inappropriate language and profanity
      </p>

      <div className="mb-5">
        <textarea
          className="w-full p-4 border border-border/60 bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all shadow-sm"
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to validate..."
          aria-label="Text to validate"
        />
      </div>

      <div className="flex items-center mb-5">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="useLLM"
            checked={useLLM}
            onChange={(e) => setUseLLM(e.target.checked)}
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
          />
          <label
            htmlFor="useLLM"
            className="ml-2.5 text-base text-foreground"
          >
            Include context analysis (LLM)
          </label>
        </div>
      </div>

      <button
        onClick={validateText}
        disabled={loading}
        className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground font-medium py-3 px-5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-sm hover:shadow"
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary-foreground"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Validating...
          </>
        ) : (
          "Validate Text"
        )}
      </button>

      {result && (
        <div className="mt-7 p-5 border border-border/40 rounded-lg bg-accent shadow-sm">
          <h3 className="font-semibold mb-3 flex items-center gap-2.5">
            {result.containsProfanity ? (
              <>
                <div className="p-1.5 bg-destructive/10 rounded-full">
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
                    className="text-destructive"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" x2="9" y1="9" y2="15" />
                    <line x1="9" x2="15" y1="9" y2="15" />
                  </svg>
                </div>
                <span className="text-destructive text-lg">
                  Contains profanity
                </span>
              </>
            ) : (
              <>
                <div className="p-1.5 bg-green-100 rounded-full dark:bg-green-900/30">
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
                    className="text-green-600 dark:text-green-400"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <span className="text-green-600 dark:text-green-400 text-lg">
                  No profanity detected
                </span>
              </>
            )}
          </h3>

          {result.severity > 0 && (
            <div className="flex items-center gap-3 mb-4 bg-background/50 p-3 rounded-lg">
              <span className="text-base font-medium text-foreground">
                Severity:
              </span>
              <div className="flex gap-1.5">
                {[1, 2, 3].map((level) => (
                  <div
                    key={level}
                    className={`h-2.5 w-7 rounded-full ${
                      level <= result.severity
                        ? "bg-primary shadow-sm"
                        : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {result.hits.length > 0 && (
            <div className="mt-4">
              <h4 className="text-base font-medium mb-3 text-foreground">
                Detected terms:
              </h4>
              <div className="space-y-2.5">
                {result.hits.map((hit, index) => (
                  <div
                    key={index}
                    className={`${getSeverityColor(
                      hit.severity || 1
                    )} px-4 py-2.5 rounded-lg text-base flex justify-between items-center shadow-sm`}
                  >
                    <span className="font-medium">{hit.term}</span>
                    <div className="flex items-center gap-2.5">
                      {hit.severity && (
                        <span className="text-sm px-2 py-0.5 rounded-md bg-background/30 backdrop-blur-sm">
                          Severity: {hit.severity}
                        </span>
                      )}
                      {hit.source && (
                        <span className="text-sm px-2 py-0.5 rounded-md bg-background/30 backdrop-blur-sm">
                          {hit.source}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
