"use client";

import { ArrowRight, ChevronDown, Search } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface SearchResult {
  title: string;
  description: string;
  excerpt: string;
  url: string;
}

function highlightMatch(value: string, query: string) {
  const needle = query.trim();
  if (!needle) return value;

  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  let offset = 0;

  return value.split(new RegExp(`(${escaped})`, "gi")).map((part) => {
    const start = offset;
    offset += part.length;

    return part.toLowerCase() === needle.toLowerCase() ? (
      <mark key={`${start}-${part}`}>{part}</mark>
    ) : (
      part
    );
  });
}

export function DocsSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const closeSearch = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeSearch();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, closeSearch]);

  useEffect(() => {
    if (!open) return;

    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

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

      {open
        ? createPortal(
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
                    className="search-dialog__escape"
                    onClick={closeSearch}
                    type="button"
                  >
                    Esc
                  </button>
                </div>

                <div className="search-results">
                  <p className="search-results__meta">
                    {!query.trim()
                      ? "Type to search documentation"
                      : loading
                        ? "Searching..."
                        : `${results.length} ${results.length === 1 ? "result" : "results"}`}
                  </p>
                  {results.map((result) => (
                    <Link
                      className="search-result"
                      href={result.url}
                      key={`${result.url}-${result.title}-${result.excerpt}`}
                      onClick={closeSearch}
                    >
                      <div>
                        <strong>{highlightMatch(result.title, query)}</strong>
                        <p>
                          {highlightMatch(
                            result.excerpt || result.description,
                            query,
                          )}
                        </p>
                      </div>
                      <ArrowRight aria-hidden="true" size={16} />
                    </Link>
                  ))}
                </div>
                <div className="search-dialog__footer">
                  <span>Filter</span>
                  <strong>All</strong>
                  <ChevronDown aria-hidden="true" size={13} />
                </div>
              </section>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
