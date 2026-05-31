import { getDocPages } from "@/lib/source";

export const revalidate = false;

export async function GET() {
  const lines: string[] = [];
  lines.push("# Documentation");
  lines.push("");
  for (const page of getDocPages()) {
    lines.push(`- [${page.title}](${page.url}): ${page.description}`);
  }
  return new Response(lines.join("\n"));
}
