"use client";

import { useState } from "react";
import { FeedbackModal } from "@/components/feedback-modal";

export function FeedbackButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 right-4 z-50 bg-background/80 backdrop-blur-md border border-border rounded-lg px-4 py-2 shadow-lg inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <span>Feedback</span>
      </button>
      <FeedbackModal open={open} onOpenChange={setOpen} />
    </>
  );
}
