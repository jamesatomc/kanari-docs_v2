import { getDocPages } from "@/lib/source";

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

export async function GET(request: Request) {
  const query =
    new URL(request.url).searchParams.get("q")?.toLowerCase().trim() ?? "";

  const results = getDocPages()
    .filter((page) => {
      if (!query) return true;
      return `${page.title} ${page.description} ${page.content}`
        .toLowerCase()
        .includes(query);
    })
    .slice(0, 12)
    .map((page) => ({
      title: page.title,
      description: page.description,
      excerpt: excerptFor(page.content, query),
      url: page.url,
    }));

  return Response.json(results);
}
