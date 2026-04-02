"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

export function ExitIntentModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("newsletter_dismissed") === "1") return;

    function handleMouseLeave(e: MouseEvent) {
      if (e.clientY <= 0) {
        setOpen(true);
        document.removeEventListener("mouseleave", handleMouseLeave);
      }
    }

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, []);

  function dismiss() {
    setOpen(false);
    localStorage.setItem("newsletter_dismissed", "1");
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={dismiss}
    >
      <div
        className="relative mx-4 max-w-md rounded-2xl bg-white p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={dismiss}
          aria-label="Close"
          className="absolute right-4 top-4 rounded p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="text-center">
          <div className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 mb-4">
            Free newsletter
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Before you go...
          </h2>
          <p className="mt-3 text-gray-600">
            Get weekly startup ideas, completely free. New research-backed opportunities every Tuesday.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/newsletter"
              onClick={dismiss}
              className="block w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              Get Weekly Ideas — Free
            </Link>
            <button
              onClick={dismiss}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              No thanks, I&apos;ll skip the ideas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
