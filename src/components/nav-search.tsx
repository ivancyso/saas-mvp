"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function NavSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center">
      <div className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-2.5 py-1.5 focus-within:border-gray-600 transition-colors">
        <Search className="h-3.5 w-3.5 shrink-0 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search startup ideas..."
          className="w-36 bg-transparent text-xs text-gray-700 placeholder-gray-400 outline-none"
        />
      </div>
    </form>
  );
}
