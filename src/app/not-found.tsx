import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";
import { SiteShell } from "@/components/site-chrome";
import { getDocsSpaces } from "@/lib/docs-spaces";

export default function NotFound() {
  return (
    <SiteShell docsSpaces={getDocsSpaces()}>
      <main className="not-found-page section-wrap">
        <section className="not-found-card">
          <p className="section-kicker">404 / PAGE NOT FOUND</p>
          <h1>
            This page
            <br />
            <span>is off the map.</span>
          </h1>
          <p>
            The documentation page may have moved, or the address may be
            incorrect. Return to the docs homepage or browse the available
            guides.
          </p>
          <div className="hero-actions">
            <Link className="button button--light" href="/">
              <ArrowLeft size={17} /> BACK HOME
            </Link>
            <Link className="button button--ghost" href="/docs">
              BROWSE DOCS <BookOpen size={17} />
            </Link>
          </div>
          <i aria-hidden="true" />
        </section>
      </main>
    </SiteShell>
  );
}
