"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { X } from "lucide-react";

export function StickyBanner() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("newsletter_dismissed") === "1") {
      setDismissed(true);
      return;
    }

    // Show after 30 seconds
    timerRef.current = setTimeout(() => {
      setVisible(true);
    }, 30_000);

    // Or after 50% scroll depth
    const sentinel = document.createElement("div");
    sentinel.style.position = "absolute";
    sentinel.style.top = "50%";
    sentinel.style.left = "0";
    sentinel.style.width = "1px";
    sentinel.style.height = "1px";
    sentinel.style.pointerEvents = "none";
    document.body.appendChild(sentinel);
    sentinelRef.current = sentinel;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0 }
    );
    observer.observe(sentinel);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      observer.disconnect();
      sentinel.remove();
    };
  }, []);

  function dismiss() {
    setDismissed(true);
    localStorage.setItem("newsletter_dismissed", "1");
  }

  if (dismissed || !visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 text-white px-4 py-3 shadow-lg">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
        <p className="text-sm font-medium">
          Get 10 new startup ideas every week &rarr;{" "}
          <Link
            href="/newsletter"
            className="underline underline-offset-2 hover:text-blue-300 transition-colors"
          >
            Subscribe Free
          </Link>
        </p>
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="shrink-0 rounded p-1 hover:bg-white/10 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
