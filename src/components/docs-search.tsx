"use client";

import { ArrowRight, Search, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface SearchResult {
  title: string;
  description: string;
  excerpt: string;
  url: string;
}

export function DocsSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;

    inputRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}`,
          {
            signal: controller.signal,
          },
        );
        setResults(await response.json());
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setResults([]);
        }
      } finally {
        setLoading(false);
      }
    }, 140);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [open, query]);

  const closeSearch = () => {
    setOpen(false);
    setQuery("");
  };

  return (
    <>
      <button
        aria-label="Search documentation"
        className="icon-button"
        onClick={() => setOpen(true)}
        type="button"
      >
        <Search size={19} />
      </button>

      {open ? (
        <div className="search-overlay">
          <button
            aria-label="Close search"
            className="search-overlay__backdrop"
            onClick={closeSearch}
            type="button"
          />
          <section
            aria-label="Search documentation"
            aria-modal="true"
            className="search-dialog"
            role="dialog"
          >
            <div className="search-dialog__header">
              <Search aria-hidden="true" size={20} />
              <input
                aria-label="Search docs"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search docs..."
                ref={inputRef}
                type="search"
                value={query}
              />
              <button
                aria-label="Close search"
                onClick={closeSearch}
                type="button"
              >
                <X size={19} />
              </button>
            </div>

            <div className="search-results">
              <p className="search-results__meta">
                {loading
                  ? "Searching..."
                  : `${results.length} ${results.length === 1 ? "result" : "results"}`}
              </p>
              {results.map((result) => (
                <Link
                  className="search-result"
                  href={result.url}
                  key={result.url}
                  onClick={closeSearch}
                >
                  <div>
                    <strong>{result.title}</strong>
                    <p>{result.description || result.excerpt}</p>
                  </div>
                  <ArrowRight aria-hidden="true" size={16} />
                </Link>
              ))}
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
