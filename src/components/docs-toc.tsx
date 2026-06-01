"use client";

import {
  AnchorProvider,
  ScrollProvider,
  TOCItem,
  useActiveAnchors,
} from "fumadocs-core/toc";
import { List } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { TocItem } from "@/lib/source";

interface TocPoint {
  bottom: number;
  top: number;
  x: number;
}

const nestedRailOffset = 20;

function getPath(points: TocPoint[]) {
  if (!points.length) return "";

  const [first, ...rest] = points;
  const commands = [
    `M ${first.x} ${first.top}`,
    `L ${first.x} ${first.bottom}`,
  ];
  let previous = first;

  for (const point of rest) {
    if (point.x === previous.x) {
      commands.push(`L ${point.x} ${point.top}`);
    } else {
      const direction = Math.sign(point.x - previous.x);
      const radius = Math.min(9, Math.abs(point.x - previous.x) / 2);
      const turnY = (previous.bottom + point.top) / 2;
      commands.push(`L ${previous.x} ${turnY - radius}`);
      commands.push(
        `Q ${previous.x} ${turnY} ${previous.x + direction * radius} ${turnY}`,
      );
      commands.push(`L ${point.x - direction * radius} ${turnY}`);
      commands.push(`Q ${point.x} ${turnY} ${point.x} ${turnY + radius}`);
      commands.push(`L ${point.x} ${point.top}`);
    }

    commands.push(`L ${point.x} ${point.bottom}`);
    previous = point;
  }

  return commands.join(" ");
}

function getMidpoint(point: TocPoint) {
  return (point.top + point.bottom) / 2;
}

function trimPathEndpoints(points: TocPoint[]) {
  const trimmed = points.map((point) => ({ ...point }));
  const first = trimmed[0];
  const last = trimmed.at(-1);

  if (first) first.top = getMidpoint(first);
  if (last) last.bottom = getMidpoint(last);

  return trimmed;
}

function TocRail({
  activeIds,
  items,
  navRef,
}: {
  activeIds: string[];
  items: TocItem[];
  navRef: React.RefObject<HTMLElement | null>;
}) {
  const [points, setPoints] = useState<TocPoint[]>([]);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const update = () => {
      setPoints(
        items.flatMap((item) => {
          const link = nav.querySelector<HTMLElement>(`a[href="#${item.id}"]`);
          if (!link) return [];

          const styles = getComputedStyle(link);
          return [
            {
              bottom:
                link.offsetTop +
                link.clientHeight -
                Number.parseFloat(styles.paddingBottom),
              top: link.offsetTop + Number.parseFloat(styles.paddingTop),
              x: item.level === 3 ? nestedRailOffset : 0,
            },
          ];
        }),
      );
    };

    const observer = new ResizeObserver(update);
    update();
    observer.observe(nav);
    return () => observer.disconnect();
  }, [items, navRef]);

  if (!points.length) return null;

  const activeIndexes = activeIds.flatMap((activeId) => {
    const index = items.findIndex((item) => item.id === activeId);
    return index === -1 ? [] : [index];
  });
  if (!activeIndexes.length) return null;

  const activeStartIndex = Math.min(...activeIndexes);
  const activeEndIndex = Math.max(...activeIndexes);
  const activePoints = trimPathEndpoints(
    points.slice(activeStartIndex, activeEndIndex + 1),
  );
  const markerPoint = points[activeStartIndex] ?? points[0];
  const width = Math.max(...points.map((point) => point.x)) + 2;
  const height = Math.max(...points.map((point) => point.bottom));
  const railPoints = trimPathEndpoints(points);

  return (
    <svg
      aria-hidden="true"
      className="docs-toc__rail"
      height={height}
      viewBox={`-4 0 ${width + 8} ${height}`}
      width={width + 8}
    >
      <path className="docs-toc__rail-base" d={getPath(railPoints)} />
      <path className="docs-toc__rail-active" d={getPath(activePoints)} />
      <circle
        className="docs-toc__rail-marker"
        cx={markerPoint?.x ?? 0}
        cy={markerPoint ? getMidpoint(markerPoint) : 0}
        r="3"
      />
    </svg>
  );
}

function TocContent({
  items,
  navRef,
}: {
  items: TocItem[];
  navRef: React.RefObject<HTMLElement | null>;
}) {
  const observedActiveIds = useActiveAnchors();
  const [atPageEnd, setAtPageEnd] = useState(false);

  useEffect(() => {
    const update = () => {
      setAtPageEnd(
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 2,
      );
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const activeIds = atPageEnd
    ? [items.at(-1)?.id ?? ""]
    : observedActiveIds.length
      ? observedActiveIds
      : [items[0]?.id ?? ""];
  const activeItems = new Set(activeIds);

  return (
    <>
      <TocRail activeIds={activeIds} items={items} navRef={navRef} />
      {items.map((item) => (
        <TOCItem
          className={`docs-toc__link docs-toc__link--level-${item.level} ${
            activeItems.has(item.id) ? "docs-toc__link--active" : ""
          }`}
          href={`#${item.id}`}
          key={item.id}
        >
          {item.title}
        </TOCItem>
      ))}
    </>
  );
}

export function DocsToc({ items }: { items: TocItem[] }) {
  const navRef = useRef<HTMLElement>(null);

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
      <AnchorProvider toc={toc}>
        <nav aria-label="On this page" ref={navRef}>
          <ScrollProvider containerRef={navRef}>
            <TocContent items={items} navRef={navRef} />
          </ScrollProvider>
        </nav>
      </AnchorProvider>
    </aside>
  );
}
