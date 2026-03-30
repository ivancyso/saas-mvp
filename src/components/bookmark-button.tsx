"use client";

import { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";

const STORAGE_KEY = "ideaflow_saved";

function getSaved(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function setSaved(slugs: string[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
}

interface BookmarkButtonProps {
  slug: string;
  className?: string;
}

export function BookmarkButton({ slug, className = "" }: BookmarkButtonProps) {
  const [saved, setSavedState] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setSavedState(getSaved().includes(slug));
  }, [slug]);

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const current = getSaved();
    const next = current.includes(slug)
      ? current.filter((s) => s !== slug)
      : [...current, slug];
    setSaved(next);
    setSavedState(next.includes(slug));
    window.dispatchEvent(new Event("ideaflow_saved_updated"));
  }

  if (!mounted) return null;

  return (
    <button
      onClick={toggle}
      aria-label={saved ? "Remove bookmark" : "Bookmark this article"}
      className={`rounded-full p-1.5 transition-colors ${
        saved
          ? "text-blue-600 bg-blue-50 hover:bg-blue-100"
          : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"
      } ${className}`}
    >
      <Bookmark className="h-4 w-4" fill={saved ? "currentColor" : "none"} />
    </button>
  );
}
