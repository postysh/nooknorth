"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface FeedbackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EMAIL = "hello@nooknorth.com";

export function FeedbackModal({ open, onOpenChange }: FeedbackModalProps) {
  const copyEmail = () => {
    navigator.clipboard.writeText(EMAIL);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-sm p-6">
        <AlertDialogTitle className="sr-only">Send Feedback</AlertDialogTitle>
        
        {/* Close button */}
        <button 
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <path d="M18 6L6 18"/>
            <path d="M6 6l12 12"/>
          </svg>
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="bg-primary/10 text-primary inline-flex size-12 items-center justify-center rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-6">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-medium text-foreground">Send Feedback</h2>
            <p className="text-xs text-muted-foreground mt-0.5">We&apos;d love to hear from you!</p>
          </div>
        </div>

        {/* Email Card */}
        <div className="mt-5 bg-muted/50 rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-2">Email us at:</p>
          <div className="flex items-center gap-2">
            <a 
              href={`mailto:${EMAIL}`}
              className="flex-1 text-sm font-medium text-primary hover:underline"
            >
              {EMAIL}
            </a>
            <button
              onClick={copyEmail}
              className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
              title="Copy email"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-4 space-y-2 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">When emailing, please include:</p>
          <ul className="space-y-1 ml-4 list-disc">
            <li>Type of feedback (bug, feature request, general)</li>
            <li>Detailed description</li>
            <li>Screenshots if applicable</li>
          </ul>
        </div>

        {/* Footer */}
        <p className="mt-4 text-[10px] text-muted-foreground/60 text-center">
          We typically respond within 48 hours
        </p>
      </AlertDialogContent>
    </AlertDialog>
  );
}
