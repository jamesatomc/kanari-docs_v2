import Link from "next/link";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function inline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const pattern = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let match = pattern.exec(text);

  while (match) {
    if (match.index > last) nodes.push(text.slice(last, match.index));

    const token = match[0];
    if (token.startsWith("`")) {
      nodes.push(
        <code
          className="rounded-md bg-black/10 px-1.5 py-0.5 text-sm dark:bg-white/10"
          key={match.index}
        >
          {token.slice(1, -1)}
        </code>,
      );
    } else if (token.startsWith("**")) {
      nodes.push(<strong key={match.index}>{token.slice(2, -2)}</strong>);
    } else {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        const [, label, href] = linkMatch;
        const external = href.startsWith("http");
        nodes.push(
          <Link
            className="font-semibold text-[var(--purple-strong)] hover:underline"
            href={href}
            key={match.index}
            rel={external ? "noreferrer" : undefined}
            target={external ? "_blank" : undefined}
          >
            {label}
          </Link>,
        );
      }
    }

    last = match.index + token.length;
    match = pattern.exec(text);
  }

  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function stripMdxNoise(markdown: string) {
  return markdown
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/<Cards>\s*/g, "")
    .replace(/\s*<\/Cards>/g, "")
    .replace(
      /<Card\s+title="([^"]+)"\s+href="([^"]+)"\s+description="([^"]+)"\s*\/>/g,
      "- [$1]($2): $3",
    )
    .replace(
      /<Callout[^>]*title="([^"]+)"[^>]*>\s*([\s\S]*?)\s*<\/Callout>/g,
      "> **$1:** $2",
    );
}

function renderTable(lines: string[], key: number) {
  const rows = lines
    .filter((line) => !/^\|\s*:?-+/.test(line))
    .map((line) =>
      line
        .split("|")
        .slice(1, -1)
        .map((cell) => cell.trim()),
    );

  const [head, ...body] = rows;

  return (
    <div className="my-6 overflow-x-auto" key={key}>
      <table className="w-full min-w-[520px] border-collapse overflow-hidden rounded-xl border border-black/10 text-sm dark:border-white/10">
        <thead className="bg-black/5 dark:bg-white/10">
          <tr>
            {head.map((cell) => (
              <th
                className="border border-black/10 px-4 py-3 text-left dark:border-white/10"
                key={cell}
              >
                {inline(cell)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, index) => (
            <tr key={`${row.join("-")}-${index}`}>
              {row.map((cell) => (
                <td
                  className="border border-black/10 px-4 py-3 dark:border-white/10"
                  key={cell}
                >
                  {inline(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function MarkdownRenderer({ content }: { content: string }) {
  const lines = stripMdxNoise(content).split(/\r?\n/);
  const nodes: React.ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      index++;
      continue;
    }

    if (/^\s{0,3}((\*\s*){3,}|(-\s*){3,}|(_\s*){3,})$/.test(line)) {
      nodes.push(<hr key={index} />);
      index++;
      continue;
    }

    const fence = line.match(/^```(\w+)?/);
    if (fence) {
      const language = fence[1] ?? "text";
      const code: string[] = [];
      index++;
      while (index < lines.length && !lines[index].startsWith("```")) {
        code.push(lines[index]);
        index++;
      }
      index++;
      nodes.push(
        <pre
          className="my-6 overflow-x-auto rounded-2xl border border-black/10 bg-[#101815] p-5 text-sm text-[#f7f4eb] dark:border-white/10"
          key={index}
        >
          <code data-language={language}>{code.join("\n")}</code>
        </pre>,
      );
      continue;
    }

    if (line.startsWith("|") && lines[index + 1]?.startsWith("|")) {
      const table: string[] = [];
      while (index < lines.length && lines[index].startsWith("|")) {
        table.push(lines[index]);
        index++;
      }
      nodes.push(renderTable(table, index));
      continue;
    }

    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      const text = heading[2];
      const id = slugify(text);
      const Heading = `h${level}` as "h1" | "h2" | "h3" | "h4";
      const className =
        level === 1
          ? "mt-0 mb-6 text-5xl font-black tracking-tight"
          : level === 2
            ? "mt-12 mb-4 text-3xl font-black tracking-tight"
            : "mt-8 mb-3 text-xl font-bold";

      nodes.push(
        <Heading className={className} id={id} key={index}>
          {inline(text)}
        </Heading>,
      );
      index++;
      continue;
    }

    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (index < lines.length && lines[index].startsWith("- ")) {
        items.push(lines[index].slice(2));
        index++;
      }
      nodes.push(
        <ul className="my-5 list-disc space-y-2 pl-6" key={index}>
          {items.map((item) => (
            <li key={item}>{inline(item)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\d+\.\s/.test(lines[index])) {
        items.push(lines[index].replace(/^\d+\.\s/, ""));
        index++;
      }
      nodes.push(
        <ol className="my-5 list-decimal space-y-2 pl-6" key={index}>
          {items.map((item) => (
            <li key={item}>{inline(item)}</li>
          ))}
        </ol>,
      );
      continue;
    }

    if (line.startsWith(">")) {
      const quote: string[] = [];
      while (index < lines.length && lines[index].startsWith(">")) {
        quote.push(lines[index].replace(/^>\s?/, ""));
        index++;
      }
      nodes.push(
        <blockquote
          className="my-6 rounded-2xl border border-[var(--lime)]/50 bg-[var(--lime)]/15 p-5 font-medium"
          key={index}
        >
          {inline(quote.join(" "))}
        </blockquote>,
      );
      continue;
    }

    const paragraph: string[] = [];
    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^(#{1,4})\s+/.test(lines[index]) &&
      !lines[index].startsWith("- ") &&
      !/^\d+\.\s/.test(lines[index]) &&
      !lines[index].startsWith("```") &&
      !lines[index].startsWith("|") &&
      !lines[index].startsWith(">") &&
      !/^\s{0,3}((\*\s*){3,}|(-\s*){3,}|(_\s*){3,})$/.test(lines[index])
    ) {
      paragraph.push(lines[index]);
      index++;
    }

    nodes.push(
      <p
        className="my-4 leading-8 text-black/70 dark:text-white/68"
        key={index}
      >
        {inline(paragraph.join(" "))}
      </p>,
    );
  }

  return <div className="docs-prose">{nodes}</div>;
}
