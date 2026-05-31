"use client";

import { ArrowRight, Github, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { NavItem } from "@/lib/source";
import { ThemeToggle } from "./theme-toggle";

function NavLinks({ items }: { items: NavItem[] }) {
  return (
    <div>
      {items.map((item) =>
        item.children ? (
          <div className="docs-nav-group" key={item.title}>
            <p className="docs-nav-title">{item.title}</p>
            {item.children.map((child) => (
              <Link
                className="docs-nav-link"
                href={child.url ?? "/docs"}
                key={child.url ?? child.title}
              >
                {child.title}
              </Link>
            ))}
          </div>
        ) : (
          <Link
            className="docs-nav-link"
            href={item.url ?? "/docs"}
            key={item.url ?? item.title}
          >
            {item.title}
          </Link>
        ),
      )}
    </div>
  );
}

export function SiteHeader() {
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
          <Link className="icon-button" href="/docs" aria-label="Search docs">
            <Search size={19} />
          </Link>
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
            href="https://github.com/kanari-network"
            rel="noreferrer"
            target="_blank"
          >
            GitHub <Github size={15} />
          </a>
        </div>
      </header>
      <div className="site-header-space" aria-hidden="true" />
    </>
  );
}

export function DocsShell({
  children,
  nav,
}: {
  children: React.ReactNode;
  nav: NavItem[];
}) {
  return (
    <>
      <SiteHeader />
      <div className="docs-layout section-wrap">
        <aside className="docs-sidebar">
          <NavLinks items={nav} />
        </aside>
        {children}
      </div>
      <SiteFooter />
    </>
  );
}

export function MobileDocNav({ nav }: { nav: NavItem[] }) {
  return (
    <details className="mobile-doc-nav">
      <summary>Documentation</summary>
      <div className="mt-5">
        <NavLinks items={nav} />
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
