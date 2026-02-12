"use client";

import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { usePathname } from "next/navigation";
import { NotificationsModal, getUnreadCount } from "@/components/notifications-modal";
import { TurnipPredictorModal } from "@/components/turnip-predictor-modal";
import { VersionModal } from "@/components/version-modal";
import { FeedbackModal } from "@/components/feedback-modal";

export function Nav() {
  const pathname = usePathname();
  const [locationsOpen, setLocationsOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [turnipPredictorOpen, setTurnipPredictorOpen] = useState(false);
  const [versionOpen, setVersionOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const isLocationsActive = pathname.startsWith('/locations');
  const isToolsActive = pathname.startsWith('/tools');

  useEffect(() => {
    setUnreadCount(getUnreadCount());
  }, [notificationsOpen]);

  // Turnip icon SVG
  const TurnipIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
      {/* Leaves */}
      <path d="M12 2c-1 2-1 4 0 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M9 3c0 2 1 4 3 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M15 3c0 2-1 4-3 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Turnip body */}
      <ellipse cx="12" cy="14" rx="6" ry="7" fill="currentColor" opacity="0.15"/>
      <ellipse cx="12" cy="14" rx="6" ry="7" stroke="currentColor" strokeWidth="1.5"/>
      {/* Root lines */}
      <path d="M10 19c0 1.5-.5 2.5-1 3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
      <path d="M14 19c0 1.5.5 2.5 1 3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
      <path d="M12 20v2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
    </svg>
  );

  return (
    <>
    {/* Main Nav - Centered */}
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-background/80 backdrop-blur-md border border-border rounded-lg px-4 py-2 shadow-lg inline-flex items-center gap-4 text-sm">
      {/* Turnips Button - Positioned after nav ends */}
      <button
        onClick={() => setTurnipPredictorOpen(true)}
        className="absolute left-full ml-2 top-0 bottom-0 bg-background/80 backdrop-blur-md border border-border rounded-lg px-4 shadow-lg inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <TurnipIcon />
        <span>Turnips</span>
        <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-primary">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <button
          onClick={() => setVersionOpen(true)}
          className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
        >
          v0.1.0
        </button>
        <div className="h-4 w-px bg-border" />
        <a 
          href="/villagers" 
          className={`hover:text-foreground transition-colors ${pathname === '/villagers' ? 'text-foreground' : ''}`}
        >
          Villagers
        </a>
        <div className="relative">
          <button 
            onClick={() => setLocationsOpen(!locationsOpen)}
            onBlur={() => setTimeout(() => setLocationsOpen(false), 150)}
            className={`hover:text-foreground transition-colors inline-flex items-center gap-1 ${isLocationsActive ? 'text-foreground' : ''}`}
          >
            Locations
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-3 h-3 transition-transform ${locationsOpen ? 'rotate-180' : ''}`}>
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>
          {locationsOpen && (
            <div className="absolute top-full left-0 mt-4 bg-background border border-border rounded-lg shadow-lg py-1 min-w-[160px]">
              <a href="/locations/fishing" className="block px-3 py-2 hover:bg-muted transition-colors whitespace-nowrap">🎣 Fishing Spots</a>
              <a href="/locations/bugs" className="block px-3 py-2 hover:bg-muted transition-colors whitespace-nowrap">🦋 Bug Hunting</a>
              <a href="/locations/diving" className="block px-3 py-2 hover:bg-muted transition-colors whitespace-nowrap">🤿 Diving</a>
            </div>
          )}
        </div>
        <a href="/" className="hover:opacity-80 transition-opacity text-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
          </svg>
        </a>
        <div className="relative">
          <button 
            onClick={() => setToolsOpen(!toolsOpen)}
            onBlur={() => setTimeout(() => setToolsOpen(false), 150)}
            className={`hover:text-foreground transition-colors inline-flex items-center gap-1 ${isToolsActive ? 'text-foreground' : ''}`}
          >
            Tools
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-3 h-3 transition-transform ${toolsOpen ? 'rotate-180' : ''}`}>
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>
          {toolsOpen && (
            <div className="absolute top-full left-0 mt-4 bg-background border border-border rounded-lg shadow-lg py-1 min-w-[160px]">
              <a href="/tools/equipment" className="block px-3 py-2 hover:bg-muted transition-colors whitespace-nowrap">🔧 Equipment</a>
              <a href="/tools/recipes" className="block px-3 py-2 hover:bg-muted transition-colors whitespace-nowrap">📋 DIY Recipes</a>
              <a href="/tools/fossils" className="block px-3 py-2 hover:bg-muted transition-colors whitespace-nowrap">🦴 Fossils</a>
              <a href="/tools/art" className="block px-3 py-2 hover:bg-muted transition-colors whitespace-nowrap">🎨 Art Guide</a>
              <a href="/tools/gyroids" className="block px-3 py-2 hover:bg-muted transition-colors whitespace-nowrap">🎵 Gyroids</a>
            </div>
          )}
        </div>
        <a 
          href="/characters" 
          className={`hover:text-foreground transition-colors ${pathname === '/characters' ? 'text-foreground' : ''}`}
        >
          Characters
        </a>
      </div>
      <div className="h-4 w-px bg-border" />
      <button 
        onClick={() => setNotificationsOpen(true)}
        className="hover:text-foreground transition-colors text-muted-foreground relative"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
        )}
      </button>
      <ThemeToggle />
      <NotificationsModal open={notificationsOpen} onOpenChange={setNotificationsOpen} />
      <VersionModal open={versionOpen} onOpenChange={setVersionOpen} />
    </nav>

    <TurnipPredictorModal open={turnipPredictorOpen} onOpenChange={setTurnipPredictorOpen} />

    {/* Feedback Button - Fixed right corner */}
    <button
      onClick={() => setFeedbackOpen(true)}
      className="fixed top-4 right-4 z-50 bg-background/80 backdrop-blur-md border border-border rounded-lg px-4 py-2 shadow-lg inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors h-[44px]"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      <span>Feedback</span>
    </button>
    <FeedbackModal open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </>
  );
}
