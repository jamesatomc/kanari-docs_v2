"use client";

import { Check, Copy, ExternalLinkIcon } from "lucide-react";
import { useState } from "react";

const cache = new Map<string, string>();

export function LLMCopyButton({ markdownUrl }: { markdownUrl: string }) {
  const [checked, setChecked] = useState(false);
  const [isLoading, setLoading] = useState(false);

  return (
    <button
      className="ai-page-action inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold disabled:opacity-60"
      disabled={isLoading}
      onClick={async () => {
        setLoading(true);
        try {
          const cached = cache.get(markdownUrl);
          const content: string =
            cached ?? (await fetch(markdownUrl).then((res) => res.text()));
          cache.set(markdownUrl, content);
          await navigator.clipboard.writeText(content);
          setChecked(true);
          window.setTimeout(() => setChecked(false), 1600);
        } finally {
          setLoading(false);
        }
      }}
      type="button"
    >
      {checked ? <Check size={16} /> : <Copy size={16} />}
      Copy Markdown
    </button>
  );
}

export function ViewOptions({
  githubUrl,
}: {
  markdownUrl: string;
  githubUrl: string;
}) {
  return (
    <a
      className="ai-page-action inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold"
      href={githubUrl}
      rel="noreferrer"
      target="_blank"
    >
      Open Source <ExternalLinkIcon size={15} />
    </a>
  );
}
