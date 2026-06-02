import type { CSSProperties } from "react";
import type { DocsSpaceTheme } from "@/lib/docs-space-types";

const themeVariables: Record<string, readonly (keyof DocsSpaceTheme)[]> = {
  "--cream": ["background", "cream"],
  "--deep-green": ["invertedSurface", "deepGreen"],
  "--ink": ["ink"],
  "--lime": ["accent", "lime"],
  "--line": ["border", "line"],
  "--muted": ["muted"],
  "--on-accent": ["onAccent"],
  "--paper": ["paper"],
  "--purple": ["secondary", "purple"],
  "--purple-strong": ["accentStrong", "purpleStrong"],
  "--section-surface": ["sectionSurface"],
  "--inverted-text": ["invertedText", "warmWhite"],
  "--warm-white": ["invertedText", "warmWhite"],
};

function getThemeValue(
  theme: DocsSpaceTheme,
  keys: readonly (keyof DocsSpaceTheme)[],
) {
  for (const key of keys) {
    const value = theme[key];
    if (value) return value;
  }
}

export function themeStyle(theme?: DocsSpaceTheme, prefix = "") {
  if (!theme) return undefined;

  return Object.fromEntries(
    Object.entries(themeVariables).flatMap(([variable, keys]) => {
      const value = getThemeValue(theme, keys);
      return value
        ? [[prefix ? variable.replace("--", `--${prefix}-`) : variable, value]]
        : [];
    }),
  ) as CSSProperties;
}
