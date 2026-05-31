import fs from "node:fs";
import path from "node:path";

const docsRoot = path.join(process.cwd(), "content", "docs");

export interface DocPage {
  title: string;
  description: string;
  content: string;
  raw: string;
  path: string;
  slugs: string[];
  url: string;
}

export interface NavItem {
  title: string;
  url?: string;
  children?: NavItem[];
}

interface Frontmatter {
  title?: string;
  description?: string;
}

function parseFrontmatter(raw: string): { data: Frontmatter; content: string } {
  if (!raw.startsWith("---")) return { data: {}, content: raw };

  const end = raw.indexOf("\n---", 3);
  if (end === -1) return { data: {}, content: raw };

  const block = raw.slice(3, end).trim();
  const data: Frontmatter = {};

  for (const line of block.split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;

    const [, key, value] = match;
    data[key as keyof Frontmatter] = value.replace(/^["']|["']$/g, "");
  }

  return {
    data,
    content: raw.slice(end + 4).trim(),
  };
}

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function fileForSlugs(slugs?: string[]) {
  const safeSlugs = slugs?.length ? slugs : ["index"];
  return `${path.join(docsRoot, ...safeSlugs)}.mdx`;
}

function slugsFromFile(filePath: string) {
  const relative = path.relative(docsRoot, filePath).replace(/\\/g, "/");
  const withoutExt = relative.replace(/\.mdx$/, "");
  return withoutExt === "index" ? [] : withoutExt.split("/");
}

function readDoc(filePath: string): DocPage | null {
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = parseFrontmatter(raw);
  const slugs = slugsFromFile(filePath);
  const fallbackTitle = slugs.length
    ? titleFromSlug(slugs.at(-1) ?? "Docs")
    : "Docs";

  return {
    title: data.title ?? fallbackTitle,
    description: data.description ?? "",
    content,
    raw,
    path: path.relative(docsRoot, filePath).replace(/\\/g, "/"),
    slugs,
    url: `/docs${slugs.length ? `/${slugs.join("/")}` : ""}`,
  };
}

function walkMdx(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkMdx(fullPath));
    if (entry.isFile() && entry.name.endsWith(".mdx")) files.push(fullPath);
  }

  return files;
}

function readMeta(dir: string): { title?: string; pages?: string[] } {
  const file = path.join(dir, "meta.json");
  if (!fs.existsSync(file)) return {};

  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function navForDir(dir: string, baseSlugs: string[] = []): NavItem[] {
  const meta = readMeta(dir);
  const entries =
    meta.pages ??
    fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((entry) => entry.name !== "meta.json")
      .map((entry) => entry.name.replace(/\.mdx$/, ""));

  const items: NavItem[] = [];

  for (const entry of entries) {
    const childDir = path.join(dir, entry);
    const file = path.join(dir, `${entry}.mdx`);

    if (fs.existsSync(childDir) && fs.statSync(childDir).isDirectory()) {
      const childMeta = readMeta(childDir);
      items.push({
        title: childMeta.title ?? titleFromSlug(entry),
        children: navForDir(childDir, [...baseSlugs, entry]),
      });
      continue;
    }

    const page = readDoc(file);
    if (!page) continue;

    items.push({
      title: page.title,
      url: page.url,
    });
  }

  return items;
}

export function getDocPage(slugs?: string[]) {
  return readDoc(fileForSlugs(slugs));
}

export function getDocPages() {
  return walkMdx(docsRoot)
    .map(readDoc)
    .filter((page): page is DocPage => Boolean(page))
    .sort((a, b) => a.url.localeCompare(b.url));
}

export function getDocNav() {
  return navForDir(docsRoot);
}

export function generateDocParams() {
  return getDocPages().map((page) => ({ slug: page.slugs }));
}

export function getPageImage(page: DocPage) {
  const segments = [...page.slugs, "image.png"];

  return {
    segments,
    url: `/og/docs/${segments.join("/")}`,
  };
}

export function getLLMText(page: DocPage) {
  return `# ${page.title}

${page.content}`;
}
