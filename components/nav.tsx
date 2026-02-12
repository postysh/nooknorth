"use client";

import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { usePathname } from "next/navigation";
import { NotificationsModal, getUnreadCount } from "@/components/notifications-modal";

export function Nav() {
  const pathname = usePathname();
  const [locationsOpen, setLocationsOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const isLocationsActive = pathname.startsWith('/locations');
  const isToolsActive = pathname.startsWith('/tools');

  useEffect(() => {
    setUnreadCount(getUnreadCount());
  }, [notificationsOpen]);

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-md border border-border rounded-lg px-4 py-2 shadow-lg inline-flex items-center gap-4 text-sm z-50">
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span className="text-xs text-muted-foreground/60">v0.1.0</span>
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
    </nav>
  );
}
