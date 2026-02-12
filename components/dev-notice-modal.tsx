"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

export function DevNoticeModal() {
  const [open, setOpen] = useState(true);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="max-w-md p-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="bg-primary/10 text-primary inline-flex size-10 items-center justify-center rounded-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-5"
            >
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
          </div>
          <h2 className="text-lg font-medium">
            Under Development
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Welcome to <span className="text-primary font-medium">Nook North</span>! 
            This app is currently under active development. Everything you see, including 
            the layout, design, images, text, and features, may change at any moment.
            <br /><br />
            This project is developed during free time, so updates may take a while. 
            Thanks for your patience and for checking it out!
          </p>
        </div>
        <AlertDialogFooter className="mt-4 sm:justify-center">
          <AlertDialogAction onClick={() => setOpen(false)} className="w-full sm:w-auto">
            Got it, let&apos;s explore!
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
