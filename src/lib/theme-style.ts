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
  "--site-shell-background": ["siteShellBackground"],
  "--inverted-text": ["invertedText", "warmWhite"],
  "--warm-white": ["invertedText", "warmWhite"],
  "--network-graphic-background": ["networkGraphicBackground"],
  "--network-graphic-shadow": ["networkGraphicShadow"],
  "--network-graphic-pattern": ["networkGraphicPattern"],
  "--network-graphic-arc": ["networkGraphicArc"],
  "--network-orbit-border": ["networkOrbitBorder"],
  "--network-orbit-shadow": ["networkOrbitShadow"],
  "--network-orbit-two-border": ["networkOrbitTwoBorder"],
  "--network-orbit-three-border": ["networkOrbitThreeBorder"],
  "--network-core-border": ["networkCoreBorder"],
  "--network-core-shadow": ["networkCoreShadow"],
  "--network-node-border": ["networkNodeBorder"],
  "--network-node-text": ["networkNodeText"],
  "--network-node-background": ["networkNodeBackground"],
  "--network-node-shadow": ["networkNodeShadow"],
  "--network-node-accent-text": ["networkNodeAccentText"],
  "--network-node-accent-background": ["networkNodeAccentBackground"],
  "--network-node-dark-text": ["networkNodeDarkText"],
  "--network-node-dark-background": ["networkNodeDarkBackground"],
  "--network-spark-background": ["networkSparkBackground"],
  "--network-spark-shadow": ["networkSparkShadow"],
  "--hero-sticker-border": ["heroStickerBorder"],
  "--hero-sticker-text": ["heroStickerText"],
  "--hero-sticker-background": ["heroStickerBackground"],
  "--hero-sticker-shadow": ["heroStickerShadow"],
  "--hero-sticker-accent-background": ["heroStickerAccentBackground"],
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
