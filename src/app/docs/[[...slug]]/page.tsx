import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DocsToc } from "@/components/docs-toc";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { MobileDocNav } from "@/components/site-chrome";
import {
  generateDocParams,
  getAdjacentDocPages,
  getDocNav,
  getDocPage,
  getDocToc,
  getPageImage,
} from "@/lib/source";

export default async function Page(props: PageProps<"/docs/[[...slug]]">) {
  const params = await props.params;
  const page = getDocPage(params.slug);
  if (!page) notFound();
  const { previous, next } = getAdjacentDocPages(page);
  const toc = getDocToc(page.content);

  return (
    <>
      <article className="docs-article">
        <MobileDocNav nav={getDocNav()} />
        <div className="docs-hero-card">
          <p className="section-kicker">Kanari Documentation</p>
          <h1 className="docs-title">{page.title}</h1>
          {page.description ? (
            <p className="docs-description">{page.description}</p>
          ) : null}
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
  return generateDocParams();
}

export async function generateMetadata(
  props: PageProps<"/docs/[[...slug]]">,
): Promise<Metadata> {
  const params = await props.params;
  const page = getDocPage(params.slug);
  if (!page) notFound();

  return {
    title: page.title,
    description: page.description,
    openGraph: {
      images: getPageImage(page).url,
    },
  };
}
