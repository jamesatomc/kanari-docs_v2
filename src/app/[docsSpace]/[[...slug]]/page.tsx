import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DocsToc } from "@/components/docs-toc";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { MobileDocNav } from "@/components/site-chrome";
import { getDocsSpaces } from "@/lib/docs-spaces";
import {
  formatDocUpdatedAt,
  getAdjacentDocPages,
  getDocNav,
  getDocPage,
  getDocPages,
  getDocToc,
  getPageImage,
} from "@/lib/source";

interface DocsPageProps {
  params: Promise<{ docsSpace: string; slug?: string[] }>;
}

function isDocsSpace(value: string) {
  return getDocsSpaces().some((space) => space.href === `/${value}`);
}

export default async function Page({ params }: DocsPageProps) {
  const { docsSpace, slug } = await params;
  if (!isDocsSpace(docsSpace)) notFound();

  const docsSpaces = getDocsSpaces();
  const page = getDocPage(slug, docsSpace);
  if (!page) notFound();
  const { previous, next } = getAdjacentDocPages(page, docsSpace);
  const toc = getDocToc(page.content);

  return (
    <>
      <article className="docs-article">
        <MobileDocNav docsSpaces={docsSpaces} nav={getDocNav(docsSpace)} />
        <div className="docs-hero-card">
          <p className="section-kicker">Kanari Documentation</p>
          <h1 className="docs-title">{page.title}</h1>
          {page.description ? (
            <p className="docs-description">{page.description}</p>
          ) : null}
          <p className="docs-updated">
            Last updated{" "}
            <time dateTime={page.updatedAt}>
              {formatDocUpdatedAt(page.updatedAt)}
            </time>
          </p>
        </div>
        <div className="docs-content-card">
          <MarkdownRenderer content={page.content} />
        </div>
        <nav className="docs-pagination" aria-label="Documentation pages">
          {previous ? (
            <Link className="docs-pagination__card" href={previous.url}>
              <span>
                <ArrowLeft size={14} /> Previous
              </span>
              <strong>{previous.title}</strong>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              className="docs-pagination__card docs-pagination__card--next"
              href={next.url}
            >
              <span>
                Next <ArrowRight size={14} />
              </span>
              <strong>{next.title}</strong>
            </Link>
          ) : null}
        </nav>
      </article>
      <DocsToc items={toc} />
    </>
  );
}

export function generateStaticParams() {
  return getDocsSpaces().flatMap((space) =>
    getDocPages(space.href.slice(1)).map((page) => ({
      docsSpace: space.href.slice(1),
      slug: page.slugs,
    })),
  );
}

export async function generateMetadata({
  params,
}: DocsPageProps): Promise<Metadata> {
  const { docsSpace, slug } = await params;
  if (!isDocsSpace(docsSpace)) notFound();

  const page = getDocPage(slug, docsSpace);
  if (!page) notFound();

  return {
    title: page.title,
    description: page.description,
    openGraph: {
      images: getPageImage(page).url,
    },
  };
}
