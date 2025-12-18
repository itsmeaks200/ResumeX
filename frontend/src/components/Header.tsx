"use client";

import { Moon, Sun, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/useStore";

export function Header() {
  const { darkMode, toggleDarkMode } = useStore();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary" />
          <span className="font-semibold text-lg">ResumeX</span>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
      </div>
    </header>
  );
}
