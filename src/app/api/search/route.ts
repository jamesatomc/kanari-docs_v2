import { getDocsSpaces } from "@/lib/docs-spaces";
import { type DocPage, getDocPages, slugifyHeading } from "@/lib/source";

export const revalidate = false;

function textOnly(content: string) {
  return content
    .replace(/<[^>]+>/g, " ")
    .replace(/[`#>*_[\]()|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function excerptFor(content: string, query: string) {
  const plainText = textOnly(content);
  if (!query) return plainText.slice(0, 150);

  const matchIndex = plainText.toLowerCase().indexOf(query);
  const start = Math.max(0, matchIndex - 52);
  const excerpt = plainText.slice(start, start + 170);

  return `${start > 0 ? "... " : ""}${excerpt}${start + 170 < plainText.length ? " ..." : ""}`;
}

interface SearchEntry {
  title: string;
  description: string;
  excerpt: string;
  url: string;
}

function entriesFor(page: DocPage): SearchEntry[] {
  const entries: SearchEntry[] = [
    {
      title: page.title,
      description: page.description,
      excerpt: textOnly(page.description),
      url: page.url,
    },
  ];
  let sectionTitle = page.title;
  let sectionUrl = page.url;
  let paragraph: string[] = [];

  const addParagraph = () => {
    const excerpt = textOnly(paragraph.join(" "));
    paragraph = [];
    if (!excerpt || excerpt === sectionTitle) return;

    entries.push({
      title: sectionTitle,
      description: page.title,
      excerpt,
      url: sectionUrl,
    });
  };

  for (const line of page.content.split(/\r?\n/)) {
    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      addParagraph();
      sectionTitle = textOnly(heading[2]);
      sectionUrl =
        heading[1].length === 1
          ? page.url
          : `${page.url}#${slugifyHeading(heading[2])}`;
      if (heading[1].length === 1) continue;

      entries.push({
        title: sectionTitle,
        description: page.title,
        excerpt: "",
        url: sectionUrl,
      });
      continue;
    }

    if (!line.trim() || /^---+$/.test(line.trim())) {
      addParagraph();
      continue;
    }

    paragraph.push(line);
  }

  addParagraph();
  return entries;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query =
    url.searchParams.get("q")?.toLowerCase().trim().slice(0, 120) ?? "";
  if (!query) return Response.json([]);

  const activeSpace = url.searchParams.get("space") ?? "all";
  const allDocsSpaces = getDocsSpaces();
  const spaces =
    activeSpace === "all"
      ? allDocsSpaces
      : allDocsSpaces.filter((space) => space.href === activeSpace);
  const pages = spaces.flatMap((space) => getDocPages(space.href.slice(1)));
  const seen = new Set<string>();

  const results = pages
    .flatMap(entriesFor)
    .filter((entry) => {
      return `${entry.title} ${entry.description} ${entry.excerpt}`
        .toLowerCase()
        .includes(query);
    })
    .sort((a, b) => {
      const aTitle = a.title.toLowerCase();
      const bTitle = b.title.toLowerCase();
      const aStartsWithQuery = aTitle.startsWith(query) ? 0 : 1;
      const bStartsWithQuery = bTitle.startsWith(query) ? 0 : 1;
      const aHasExcerpt = a.excerpt ? 0 : 1;
      const bHasExcerpt = b.excerpt ? 0 : 1;

      return (
        aStartsWithQuery - bStartsWithQuery ||
        aTitle.localeCompare(bTitle) ||
        a.url.localeCompare(b.url) ||
        aHasExcerpt - bHasExcerpt
      );
    })
    .filter((entry) => {
      const key = `${entry.url}\n${entry.title}`;
      if (seen.has(key)) return false;

      seen.add(key);
      return true;
    })
    .slice(0, 48)
    .map((entry) => ({
      ...entry,
      excerpt: excerptFor(entry.excerpt, query),
    }));

  return Response.json(results);
}
