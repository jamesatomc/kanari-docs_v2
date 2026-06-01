"use client";

import {
  TOCProvider,
  TOCScrollArea,
  useTOCItems,
} from "fumadocs-ui/components/toc";
import { TOCEmpty, TOCItem, TOCItems } from "fumadocs-ui/components/toc/clerk";
import { List } from "lucide-react";
import type { TocItem } from "@/lib/source";

function TocTree() {
  const items = useTOCItems();

  if (!items.length) return <TOCEmpty />;

  return (
    <TOCItems className="docs-toc__items">
      {items.map((item) => (
        <TOCItem item={item} key={item.url} />
      ))}
    </TOCItems>
  );
}

export function DocsToc({ items }: { items: TocItem[] }) {
  if (!items.length) return null;

  const toc = items.map((item) => ({
    depth: item.level,
    title: item.title,
    url: `#${item.id}`,
  }));

  return (
    <aside className="docs-toc">
      <p className="docs-toc__title">
        <List aria-hidden="true" size={15} /> On this page
      </p>
      <TOCProvider toc={toc}>
        <TOCScrollArea className="docs-toc__scroll">
          <TocTree />
        </TOCScrollArea>
      </TOCProvider>
    </aside>
  );
}
