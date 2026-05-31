import { getDocPages } from "@/lib/source";

export const revalidate = false;

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
      url: page.url,
    }));

  return Response.json(results);
}
