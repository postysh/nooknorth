"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface VersionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VersionModal({ open, onOpenChange }: VersionModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-sm p-6">
        <AlertDialogTitle className="sr-only">Version Information</AlertDialogTitle>
        
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

        {/* Header - Centered */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="bg-primary/10 text-primary inline-flex size-12 items-center justify-center rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-6">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-medium text-foreground">Nook North</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Animal Crossing: <span className="text-primary">New Horizons</span> companion</p>
          </div>
        </div>

        {/* Version Cards */}
        <div className="grid grid-cols-2 gap-3 mt-5">
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">App Version</p>
            <p className="text-lg font-semibold text-foreground">0.1.0</p>
          </div>
          <div className="bg-primary/10 rounded-lg p-3 text-center">
            <p className="text-[10px] uppercase tracking-wide text-primary/70 mb-1">ACNH Version</p>
            <p className="text-lg font-semibold text-primary">3.0.0</p>
          </div>
        </div>

        {/* Info */}
        <div className="mt-5 pt-4 border-t border-border space-y-2 text-center">
          <p className="text-xs text-muted-foreground">
            Data provided by{" "}
            <a 
              href="https://nookipedia.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary hover:underline"
            >
              Nookipedia
            </a>
          </p>
          <p className="text-[10px] text-muted-foreground/60">
            Not affiliated with Nintendo
          </p>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
