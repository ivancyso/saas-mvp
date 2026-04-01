"use client";

import { useEffect, useRef, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [open, setOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (items.length === 0) return;

    const headingIds = items.map((item) => item.id);

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "0px 0px -60% 0px", threshold: 0 }
    );

    for (const id of headingIds) {
      const el = document.getElementById(id);
      if (el) observerRef.current.observe(el);
    }

    return () => observerRef.current?.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <>
      {/* Mobile dropdown */}
      <div className="lg:hidden mb-6 border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => setOpen((o) => !o)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors"
          aria-expanded={open}
        >
          <span>Contents</span>
          <span className="text-gray-400">{open ? "↑" : "↓"}</span>
        </button>
        {open && (
          <nav className="px-4 py-3 space-y-1">
            {items.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setOpen(false)}
                className={`block text-sm py-1 transition-colors ${
                  item.level === 3 ? "pl-4" : ""
                } ${
                  activeId === item.id
                    ? "text-blue-600 font-medium"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {item.text}
              </a>
            ))}
          </nav>
        )}
      </div>

      {/* Desktop sticky sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-8 w-56 shrink-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
            Contents
          </p>
          <nav className="space-y-1">
            {items.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`block text-sm py-1 leading-snug transition-colors border-l-2 ${
                  item.level === 3 ? "pl-5" : "pl-3"
                } ${
                  activeId === item.id
                    ? "border-blue-500 text-blue-600 font-medium"
                    : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
                }`}
              >
                {item.text}
              </a>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
