"use client";

import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  ChevronsUpDown,
  FileText,
  Layers3,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  type DocsSpace,
  type DocsSpaceTheme,
  getDocsSpace,
  withDocsSpace,
} from "@/lib/docs-space-types";
import type { NavItem } from "@/lib/source";
import { themeStyle } from "@/lib/theme-style";
import { DocsSearch } from "./docs-search";
import { ThemeToggle } from "./theme-toggle";

const docsSpaceIcons: Record<DocsSpace["icon"], typeof BookOpen> = {
  book: BookOpen,
  file: FileText,
  layers: Layers3,
};

function isActiveDocUrl(
  pathname: string,
  url: string | undefined,
  docsSpace: string,
) {
  return pathname === withDocsSpace(url, docsSpace);
}

function hasActiveChild(
  item: NavItem,
  pathname: string,
  docsSpace: string,
): boolean {
  if (item.url && isActiveDocUrl(pathname, item.url, docsSpace)) return true;
  return (
    item.children?.some((child) =>
      hasActiveChild(child, pathname, docsSpace),
    ) ?? false
  );
}

function NavLinks({
  docsSpaces,
  items,
}: {
  docsSpaces: DocsSpace[];
  items: NavItem[];
}) {
  const pathname = usePathname();
  const docsSpace = getDocsSpace(docsSpaces, pathname).href;

  return (
    <div className="docs-nav-tree">
      {items.map((item, index) => {
        if (item.type === "separator") {
          return (
            <p className="docs-nav-separator" key={`${item.title}-${index}`}>
              {item.title}
            </p>
          );
        }

        if (item.children) {
          const active = hasActiveChild(item, pathname, docsSpace);
          const content = (
            <NavLinks docsSpaces={docsSpaces} items={item.children} />
          );

          if (item.collapsible === false) {
            return (
              <div className="docs-nav-group" key={`${item.title}-${index}`}>
                <p className="docs-nav-title">{item.title}</p>
                {content}
              </div>
            );
          }

          return (
            <details
              className="docs-nav-folder"
              key={`${item.title}-${index}`}
              open={item.defaultOpen || active}
            >
              <summary>
                {item.title}
                <ChevronDown aria-hidden="true" size={14} />
              </summary>
              {content}
            </details>
          );
        }

        const external = item.external || item.url?.startsWith("http");
        const href = external ? item.url : withDocsSpace(item.url, docsSpace);

        return (
          <Link
            className={`docs-nav-link ${isActiveDocUrl(pathname, item.url, docsSpace) ? "docs-nav-link--active" : ""}`}
            href={href ?? docsSpace}
            key={`${item.title}-${item.url ?? index}`}
            rel={external ? "noreferrer" : undefined}
            target={external ? "_blank" : undefined}
          >
            {item.title}
          </Link>
        );
      })}
    </div>
  );
}

function DocsSwitcher({ docsSpaces }: { docsSpaces: DocsSpace[] }) {
  const pathname = usePathname();
  const currentSpace = getDocsSpace(docsSpaces, pathname);
  const CurrentIcon = docsSpaceIcons[currentSpace.icon];

  return (
    <details className="docs-switcher">
      <summary>
        <CurrentIcon aria-hidden="true" size={17} />
        <span>
          <strong>{currentSpace.title}</strong>
          <small>{currentSpace.description}</small>
        </span>
        <ChevronsUpDown aria-hidden="true" size={16} />
      </summary>
      <div className="docs-switcher__menu">
        {docsSpaces.map((space) => {
          const Icon = docsSpaceIcons[space.icon];
          const isCurrent = currentSpace.href === space.href;

          return (
            <Link
              className="docs-switcher__link"
              href={space.href}
              key={space.href}
            >
              <Icon aria-hidden="true" size={17} />
              <span>
                <strong>{space.title}</strong>
                <small>{space.description}</small>
              </span>
              {isCurrent ? <Check aria-hidden="true" size={15} /> : null}
            </Link>
          );
        })}
      </div>
    </details>
  );
}

export function SiteHeader({ docsSpaces }: { docsSpaces: DocsSpace[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const previousScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollingUp = currentScrollY < previousScrollY.current;

      setHeaderVisible(menuOpen || currentScrollY < 80 || scrollingUp);
      previousScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  return (
    <>
      <header
        className={`site-header ${headerVisible ? "" : "site-header--hidden"}`}
      >
        <Link className="brand" href="/" aria-label="Kanari Docs home">
          <Image src="/kariicon1.png" alt="" width={42} height={42} priority />
          <span>kanari</span>
          <small>docs</small>
        </Link>

        <nav
          className={`site-nav ${menuOpen ? "site-nav--open" : ""}`}
          aria-label="Main navigation"
        >
          <Link
            href="https://kanarinetwork.site/DeveloperPortal"
            onClick={() => setMenuOpen(false)}
          >
            Developers
          </Link>
          <Link
            href="https://kanari-blog.vercel.app/"
            onClick={() => setMenuOpen(false)}
          >
            Blog
          </Link>
          <Link
            href="https://github.com/kanari-network"
            onClick={() => setMenuOpen(false)}
          >
            GitHub
          </Link>
          <Link href="/docs" onClick={() => setMenuOpen(false)}>
            Docs
          </Link>
        </nav>

        <div className="site-header__actions">
          <ThemeToggle />
          <DocsSearch docsSpaces={docsSpaces} />
          <button
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            type="button"
          >
            <span />
            <span />
          </button>
          <a
            className="header-button"
            href="https://kanarinetwork.site/"
            rel="noreferrer"
            target="_blank"
          >
            Network <span aria-hidden="true">+</span>
          </a>
        </div>
      </header>
      <div className="site-header-space" aria-hidden="true" />
    </>
  );
}

export function DocsShell({
  children,
  docsSpaces,
  nav,
  theme,
}: {
  children: React.ReactNode;
  docsSpaces: DocsSpace[];
  nav: NavItem[];
  theme?: DocsSpaceTheme;
}) {
  return (
    <div className="docs-space-theme" style={themeStyle(theme)}>
      <SiteHeader docsSpaces={docsSpaces} />
      <div className="docs-layout section-wrap">
        <aside className="docs-sidebar">
          <DocsSwitcher docsSpaces={docsSpaces} />
          <NavLinks docsSpaces={docsSpaces} items={nav} />
        </aside>
        {children}
      </div>
      <SiteFooter />
    </div>
  );
}

export function MobileDocNav({
  docsSpaces,
  nav,
}: {
  docsSpaces: DocsSpace[];
  nav: NavItem[];
}) {
  return (
    <details className="mobile-doc-nav">
      <summary>Documentation</summary>
      <div className="mt-5">
        <DocsSwitcher docsSpaces={docsSpaces} />
        <NavLinks docsSpaces={docsSpaces} items={nav} />
      </div>
    </details>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer section-wrap">
      <Link className="brand" href="/">
        <Image src="/kariicon1.png" alt="" width={36} height={36} />
        <span>kanari</span>
      </Link>
      <p>Developer documentation for verifiable metadata infrastructure.</p>
      <div>
        <a href="https://kanarinetwork.site/">Network</a>
        <a href="https://kanari-blog.vercel.app/">Articles</a>
        <Link href="/docs">Docs</Link>
        <Link href="/docs/introduction/getting-started">Quick start</Link>
        <Link href="/docs/api/api-reference">API</Link>
        <a href="https://kanarinetwork.site/DeveloperPortal">Developers</a>
        <a href="https://github.com/kanari-network">GitHub</a>
      </div>
    </footer>
  );
}

export function TextLink({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  return (
    <Link
      className="inline-flex items-center gap-2 font-black uppercase tracking-[0.13em]"
      href={href}
    >
      {children} <ArrowRight size={14} />
    </Link>
  );
}
