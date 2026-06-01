import fs from "node:fs";
import path from "node:path";
import type { DocsSpaceTheme, SiteTheme } from "@/lib/docs-space-types";

const themeFile = path.join(process.cwd(), "content", "theme.json");
const defaultThemeFile = path.join(
  process.cwd(),
  "content",
  "theme-default.json",
);
const defaultTheme = JSON.parse(
  fs.readFileSync(defaultThemeFile, "utf8"),
) as SiteTheme;

const themeAliases: Partial<
  Record<keyof DocsSpaceTheme, keyof DocsSpaceTheme>
> = {
  accent: "lime",
  accentStrong: "purpleStrong",
  background: "cream",
  border: "line",
  invertedSurface: "deepGreen",
  invertedText: "warmWhite",
  lime: "accent",
  purple: "secondary",
  purpleStrong: "accentStrong",
  cream: "background",
  deepGreen: "invertedSurface",
  warmWhite: "invertedText",
  line: "border",
  secondary: "purple",
};

function normalizePalette(palette: DocsSpaceTheme): DocsSpaceTheme {
  const normalized = { ...palette };

  for (const [key, alias] of Object.entries(themeAliases) as [
    keyof DocsSpaceTheme,
    keyof DocsSpaceTheme,
  ][]) {
    normalized[alias] ??= normalized[key];
  }

  return normalized;
}

function mergePalette(
  defaults: DocsSpaceTheme,
  configured?: DocsSpaceTheme,
): DocsSpaceTheme {
  const merged = normalizePalette(defaults);

  for (const [key, value] of Object.entries(configured ?? {}) as [
    keyof DocsSpaceTheme,
    string | undefined,
  ][]) {
    if (!value) continue;
    merged[key] = value;

    const alias = themeAliases[key];
    if (alias) merged[alias] = value;
  }

  return normalizePalette(merged);
}

export function resolveSiteTheme(
  configured: Partial<SiteTheme> = {},
): SiteTheme {
  return {
    dark: mergePalette(defaultTheme.dark, configured.dark),
    light: mergePalette(defaultTheme.light, configured.light),
  };
}

export function getSiteTheme(): SiteTheme {
  if (!fs.existsSync(themeFile)) return resolveSiteTheme();

  const configured = JSON.parse(
    fs.readFileSync(themeFile, "utf8"),
  ) as Partial<SiteTheme>;

  return resolveSiteTheme(configured);
}
