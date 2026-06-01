import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { getDocsSpaces } from "@/lib/docs-spaces";

const contentRoot = path.join(process.cwd(), "content");

export interface DocPage {
  title: string;
  description: string;
  content: string;
  raw: string;
  path: string;
  slugs: string[];
  updatedAt?: string;
  url: string;
}

export interface NavItem {
  collapsible?: boolean;
  defaultOpen?: boolean;
  external?: boolean;
  title: string;
  type?: "folder" | "link" | "page" | "separator";
  url?: string;
  children?: NavItem[];
}

export interface TocItem {
  id: string;
  title: string;
  level: 2 | 3;
}

interface Frontmatter {
  title?: string;
  description?: string;
  updated?: string;
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

export function slugifyHeading(value: string) {
  return value
    .toLowerCase()
    .replace(/[`*_~[\]()]/g, "")
    .replace(/[^\p{L}\p{M}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function getDocToc(content: string): TocItem[] {
  return content
    .split(/\r?\n/)
    .flatMap((line) => {
      const match = line.match(/^(#{2,3})\s+(.+)$/);
      if (!match) return [];

      const title = match[2].trim();
      return [
        {
          id: slugifyHeading(title),
          title: title.replace(/[`*_~]/g, ""),
          level: match[1].length as 2 | 3,
        },
      ];
    })
    .filter((item) => item.id);
}

function getDocSource(docsSpace = "docs") {
  const space = getDocsSpaces().find((item) => item.href === `/${docsSpace}`);

  return {
    docsRoot: path.join(contentRoot, space?.content ?? docsSpace),
    href: space?.href ?? `/${docsSpace}`,
  };
}

function fileForSlugs(docsRoot: string, slugs?: string[]) {
  const safeSlugs = slugs?.length ? slugs : ["index"];
  return `${path.join(docsRoot, ...safeSlugs)}.mdx`;
}

function slugsFromFile(docsRoot: string, filePath: string) {
  const relative = path.relative(docsRoot, filePath).replace(/\\/g, "/");
  const withoutExt = relative.replace(/\.mdx$/, "");
  return withoutExt === "index" ? [] : withoutExt.split("/");
}

function getUpdatedAt(filePath: string, configuredDate?: string) {
  if (configuredDate) {
    const date = new Date(configuredDate);
    if (!Number.isNaN(date.getTime())) return date.toISOString();
  }

  try {
    const updatedAt = execFileSync(
      "git",
      ["log", "-1", "--format=%cI", "--", filePath],
      {
        cwd: process.cwd(),
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      },
    ).trim();

    if (updatedAt) return new Date(updatedAt).toISOString();
  } catch {
    return undefined;
  }
}

function readDoc(
  docsRoot: string,
  href: string,
  filePath: string,
): DocPage | null {
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = parseFrontmatter(raw);
  const updatedAt = getUpdatedAt(filePath, data.updated);
  const slugs = slugsFromFile(docsRoot, filePath);
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
    updatedAt,
    url: `${href}${slugs.length ? `/${slugs.join("/")}` : ""}`,
  };
}

function walkMdx(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkMdx(fullPath));
    if (entry.isFile() && entry.name.endsWith(".mdx")) files.push(fullPath);
  }

  return files;
}

interface DocsMeta {
  collapsible?: boolean;
  defaultOpen?: boolean;
  pages?: string[];
  title?: string;
}

function readMeta(dir: string): DocsMeta {
  const file = path.join(dir, "meta.json");
  if (!fs.existsSync(file)) return {};

  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function getDirEntries(dir: string) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.name !== "meta.json")
    .map((entry) => entry.name.replace(/\.mdx$/, ""))
    .sort((a, b) => a.localeCompare(b));
}

function expandMetaPages(dir: string, pages?: string[]) {
  const entries = getDirEntries(dir);
  if (!pages) return entries;

  const excluded = new Set(
    pages
      .filter((entry) => entry.startsWith("!"))
      .map((entry) => entry.slice(1)),
  );
  const explicit = new Set(
    pages
      .filter((entry) => !entry.startsWith("!"))
      .filter((entry) => entry !== "..."),
  );
  const remaining = entries.filter(
    (entry) => !excluded.has(entry) && !explicit.has(entry),
  );

  return pages.flatMap((entry) => {
    if (entry === "...") return remaining;
    if (entry.startsWith("!")) return [];
    return [entry];
  });
}

function metaNavItem(entry: string): NavItem | null {
  const separator = entry.match(/^---(.+)---$/);
  if (separator) {
    return { title: separator[1], type: "separator" };
  }

  const link = entry.match(/^(external:)?\[([^\]]+)\]\(([^)]+)\)$/);
  if (link) {
    return {
      external: Boolean(link[1]),
      title: link[2],
      type: "link",
      url: link[3],
    };
  }

  return null;
}

function navForDir(
  docsRoot: string,
  href: string,
  dir: string,
  baseSlugs: string[] = [],
): NavItem[] {
  const meta = readMeta(dir);
  const entries = expandMetaPages(dir, meta.pages);

  const items: NavItem[] = [];

  for (const entry of entries) {
    const configuredItem = metaNavItem(entry);
    if (configuredItem) {
      items.push(configuredItem);
      continue;
    }

    const childDir = path.join(dir, entry);
    const file = path.join(dir, `${entry}.mdx`);

    if (fs.existsSync(childDir) && fs.statSync(childDir).isDirectory()) {
      const childMeta = readMeta(childDir);
      items.push({
        collapsible: childMeta.collapsible,
        defaultOpen: childMeta.defaultOpen,
        title: childMeta.title ?? titleFromSlug(entry),
        type: "folder",
        children: navForDir(docsRoot, href, childDir, [...baseSlugs, entry]),
      });
      continue;
    }

    const page = readDoc(docsRoot, href, file);
    if (!page) continue;

    items.push({
      title: page.title,
      type: "page",
      url: page.url,
    });
  }

  return items;
}

export function getDocPage(slugs?: string[], docsSpace = "docs") {
  const { docsRoot, href } = getDocSource(docsSpace);
  return readDoc(docsRoot, href, fileForSlugs(docsRoot, slugs));
}

export function getDocPages(docsSpace = "docs") {
  const { docsRoot, href } = getDocSource(docsSpace);
  return walkMdx(docsRoot)
    .map((file) => readDoc(docsRoot, href, file))
    .filter((page): page is DocPage => Boolean(page))
    .sort((a, b) => a.url.localeCompare(b.url));
}

export function getAdjacentDocPages(page: DocPage, docsSpace = "docs") {
  const pagesByUrl = new Map(
    getDocPages(docsSpace).map((item) => [item.url, item]),
  );
  const orderedUrls = flattenNav(getDocNav(docsSpace));
  const pages = orderedUrls.flatMap((url) => {
    const item = pagesByUrl.get(url);
    return item ? [item] : [];
  });
  const index = pages.findIndex((item) => item.url === page.url);

  return {
    previous: index > 0 ? pages[index - 1] : null,
    next: index >= 0 && index < pages.length - 1 ? pages[index + 1] : null,
  };
}

export function getDocNav(docsSpace = "docs") {
  const { docsRoot, href } = getDocSource(docsSpace);
  return navForDir(docsRoot, href, docsRoot);
}

function flattenNav(items: NavItem[]): string[] {
  return items.flatMap((item) =>
    item.children
      ? flattenNav(item.children)
      : item.type === "page" && item.url
        ? [item.url]
        : [],
  );
}

export function generateDocParams(docsSpace = "docs") {
  return getDocPages(docsSpace).map((page) => ({ slug: page.slugs }));
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

export function formatDocUpdatedAt(updatedAt: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
    year: "numeric",
  }).format(new Date(updatedAt));
}
