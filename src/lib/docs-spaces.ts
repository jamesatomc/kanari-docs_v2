import fs from "node:fs";
import path from "node:path";
import type { DocsSpace } from "@/lib/docs-space-types";

const contentRoot = path.join(process.cwd(), "content");
const icons = ["book", "file", "layers"] as const;

interface SpaceMeta {
  description?: string;
  href?: string;
  icon?: DocsSpace["icon"];
  source?: string;
  title?: string;
}

interface RootMeta {
  space?: SpaceMeta;
}

function readRootMeta(dir: string): RootMeta {
  const file = path.join(dir, "meta.json");
  if (!fs.existsSync(file)) return {};

  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function isIcon(value: string | undefined): value is DocsSpace["icon"] {
  return icons.some((icon) => icon === value);
}

export function getDocsSpaces(): DocsSpace[] {
  return fs
    .readdirSync(contentRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) => {
      const meta = readRootMeta(path.join(contentRoot, entry.name));
      if (!meta.space?.title) return [];

      return [
        {
          content: meta.space.source ?? entry.name,
          description: meta.space.description ?? "",
          href: meta.space.href ?? `/${entry.name}`,
          icon: isIcon(meta.space.icon) ? meta.space.icon : "file",
          title: meta.space.title,
        },
      ];
    })
    .sort((a, b) => a.href.localeCompare(b.href, undefined, { numeric: true }));
}
