export interface DocsSpace {
  content: string;
  description: string;
  href: string;
  icon: "book" | "file" | "layers";
  theme?: DocsSpaceTheme;
  title: string;
}

export interface DocsSpaceTheme {
  cream?: string;
  deepGreen?: string;
  line?: string;
  lime?: string;
  purple?: string;
  purpleStrong?: string;
  warmWhite?: string;
  accent?: string;
  accentStrong?: string;
  background?: string;
  border?: string;
  invertedSurface?: string;
  invertedText?: string;
  ink?: string;
  muted?: string;
  onAccent?: string;
  paper?: string;
  secondary?: string;
  sectionSurface?: string;
}

export interface SiteTheme {
  dark: DocsSpaceTheme;
  light: DocsSpaceTheme;
}

export function getDocsSpace(docsSpaces: DocsSpace[], pathname: string) {
  return (
    docsSpaces.find(
      (space) =>
        pathname === space.href || pathname.startsWith(`${space.href}/`),
    ) ?? docsSpaces[0]
  );
}

export function withDocsSpace(url: string | undefined, docsSpace: string) {
  if (!url) return docsSpace;
  return url.replace(/^\/[^/]+(?=\/|$)/, docsSpace);
}
