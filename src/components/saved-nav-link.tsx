"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "ideaflow_saved";

function getSavedCount(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as string[]) : [];
    return parsed.length;
  } catch {
    return 0;
  }
}

export function SavedNavLink() {
  const [count, setCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCount(getSavedCount());

    function onUpdate() {
      setCount(getSavedCount());
    }

    window.addEventListener("ideaflow_saved_updated", onUpdate);
    return () => window.removeEventListener("ideaflow_saved_updated", onUpdate);
  }, []);

  if (!mounted) {
    return (
      <Link
        href="/saved"
        className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
      >
        Saved
      </Link>
    );
  }

  return (
    <Link
      href="/saved"
      className="relative text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
    >
      Saved
      {count > 0 && (
        <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-blue-600 px-1.5 py-0.5 text-xs font-semibold text-white leading-none">
          {count}
        </span>
      )}
    </Link>
  );
}
