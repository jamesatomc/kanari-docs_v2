"use client";

import { List } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { TocItem } from "@/lib/source";

export function DocsToc({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const [marker, setMarker] = useState({ height: 0, top: 0 });
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!items.length) return;

    const headings = items.flatMap((item) => {
      const element = document.getElementById(item.id);
      return element ? [element] : [];
    });

    const onScroll = () => {
      const current = headings.reduce((closest, heading) => {
        return heading.getBoundingClientRect().top <= 140 ? heading : closest;
      }, headings[0]);

      if (current) setActiveId(current.id);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);

  useEffect(() => {
    const nav = navRef.current;
    const activeLink = nav?.querySelector<HTMLElement>(
      `.docs-toc__link[href="#${activeId}"]`,
    );

    if (!activeLink) return;
    setMarker({ height: activeLink.offsetHeight, top: activeLink.offsetTop });
  }, [activeId]);

  if (!items.length) return null;

  return (
    <aside className="docs-toc">
      <p className="docs-toc__title">
        <List aria-hidden="true" size={15} /> On this page
      </p>
      <nav aria-label="On this page" ref={navRef}>
        <i
          aria-hidden="true"
          className="docs-toc__marker"
          style={{
            height: marker.height,
            transform: `translateY(${marker.top}px)`,
          }}
        />
        {items.map((item) => (
          <a
            className={`docs-toc__link docs-toc__link--level-${item.level} ${activeId === item.id ? "docs-toc__link--active" : ""
              }`}
            href={`#${item.id}`}
            key={item.id}
          >
            {item.title}
          </a>
        ))}
      </nav>
    </aside>
  );
}
