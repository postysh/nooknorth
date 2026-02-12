"use client";

import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const STORAGE_KEY = "nooknorth-notifications-read";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
}

const LeafIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
  </svg>
);

const defaultNotifications: Notification[] = [
  {
    id: "1",
    title: "Welcome to Nook North!",
    message: "Thanks for checking out the app. Stay tuned for updates!",
    time: "Just now",
  },
  {
    id: "2",
    title: "Villager Cards",
    message: "Browse villagers with the new carousel on the home page.",
    time: "1 day ago",
  },
];

export function getReadIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveReadIds(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function getUnreadCount(): number {
  const readIds = getReadIds();
  return defaultNotifications.filter(n => !readIds.includes(n.id)).length;
}

interface NotificationsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotificationsModal({ open, onOpenChange }: NotificationsModalProps) {
  const [readIds, setReadIds] = useState<string[]>([]);
  const notifications = defaultNotifications;
  
  useEffect(() => {
    setReadIds(getReadIds());
  }, []);

  const isRead = (id: string) => readIds.includes(id);
  const unreadCount = notifications.filter(n => !isRead(n.id)).length;

  const markAllAsRead = () => {
    const allIds = notifications.map(n => n.id);
    setReadIds(allIds);
    saveReadIds(allIds);
  };

  const markAsRead = (id: string) => {
    if (!isRead(id)) {
      const newReadIds = [...readIds, id];
      setReadIds(newReadIds);
      saveReadIds(newReadIds);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-sm p-0 overflow-hidden gap-0">
        <AlertDialogTitle className="sr-only">Notifications</AlertDialogTitle>
        
        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-medium text-foreground">Notifications</h2>
            {unreadCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground font-medium">
                {unreadCount}
              </span>
            )}
          </div>
          <button 
            onClick={() => onOpenChange(false)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M18 6L6 18"/>
              <path d="M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Notifications List */}
        <div className="max-h-[320px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <div className="text-3xl mb-2">🔔</div>
              <p className="text-sm text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            <div>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={`px-4 py-3 flex gap-3 hover:bg-muted/50 transition-colors cursor-pointer ${
                    !isRead(notification.id) ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <LeafIcon />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-foreground truncate">
                        {notification.title}
                      </h3>
                      {!isRead(notification.id) && (
                        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {notification.message}
                    </p>
                    <span className="text-[10px] text-muted-foreground/70 mt-1 block">
                      {notification.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && unreadCount > 0 && (
          <div className="p-3 border-t border-border">
            <button 
              onClick={markAllAsRead}
              className="w-full text-xs text-center text-muted-foreground hover:text-foreground transition-colors py-1"
            >
              Mark all as read
            </button>
          </div>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
