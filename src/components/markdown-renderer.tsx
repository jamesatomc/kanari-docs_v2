import { evaluate } from "@mdx-js/mdx";
import { ArrowRight, Info } from "lucide-react";
import Link from "next/link";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import { slugifyHeading } from "@/lib/source";

interface CardProps {
  title: string;
  href: string;
  description?: string;
}

interface CalloutProps {
  children: React.ReactNode;
  title?: string;
  type?: "info" | "warning" | "success";
}

function prepareMdx(content: string) {
  return content.replace(
    /<([A-Z][A-Z0-9_]*)(?:\s[^>]*)?>/g,
    (placeholder) => `&lt;${placeholder.slice(1, -1)}&gt;`,
  );
}

function Cards({ children }: { children: React.ReactNode }) {
  return <div className="mdx-card-grid">{children}</div>;
}

function Card({ title, href, description }: CardProps) {
  const external = href.startsWith("http");

  return (
    <Link
      className="mdx-card"
      href={href}
      rel={external ? "noreferrer" : undefined}
      target={external ? "_blank" : undefined}
    >
      <strong>{title}</strong>
      {description ? <p>{description}</p> : null}
      <span>
        Open resource <ArrowRight aria-hidden="true" size={14} />
      </span>
    </Link>
  );
}

function Callout({ children, title = "Note", type = "info" }: CalloutProps) {
  return (
    <aside className={`mdx-callout mdx-callout--${type}`}>
      <div className="mdx-callout__title">
        <Info aria-hidden="true" size={17} />
        <strong>{title}</strong>
      </div>
      <div>{children}</div>
    </aside>
  );
}

function heading(level: 1 | 2 | 3 | 4 | 5 | 6) {
  const Heading = `h${level}` as keyof React.JSX.IntrinsicElements;

  return function MdxHeading({ children }: { children?: React.ReactNode }) {
    const title = typeof children === "string" ? children : String(children);
    return <Heading id={slugifyHeading(title)}>{children}</Heading>;
  };
}

export async function MarkdownRenderer({ content }: { content: string }) {
  const { default: Content } = await evaluate(prepareMdx(content), {
    ...runtime,
    baseUrl: import.meta.url,
    remarkPlugins: [remarkGfm],
  });

  return (
    <div className="docs-prose">
      <Content
        components={{
          Card,
          Cards,
          Callout,
          h1: heading(1),
          h2: heading(2),
          h3: heading(3),
          h4: heading(4),
          h5: heading(5),
          h6: heading(6),
        }}
      />
    </div>
  );
}
