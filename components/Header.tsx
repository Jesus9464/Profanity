import React from "react";

export const Header = () => {
  return (
    <header className="flex items-center gap-5 mb-12 pb-6 border-b border-border/40">
      <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground shadow-md">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M12 8v4" />
          <path d="M12 16h.01" />
        </svg>
      </div>
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Profanity Service
        </h1>
        <p className="text-base text-muted-foreground mt-1">
          Content moderation and filtering tool
        </p>
      </div>
    </header>
  );
};
