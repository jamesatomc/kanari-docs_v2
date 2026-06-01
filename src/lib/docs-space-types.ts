export interface DocsSpace {
  content: string;
  description: string;
  href: string;
  icon: "book" | "file" | "layers";
  title: string;
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
