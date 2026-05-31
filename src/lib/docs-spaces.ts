import docsSpaces from "../../content/docs-spaces.json";

export interface DocsSpace {
  description: string;
  href: string;
  icon: "book" | "file" | "layers";
  title: string;
}

function isDocsSpace(space: (typeof docsSpaces)[number]): space is DocsSpace {
  return (
    typeof space.description === "string" &&
    typeof space.href === "string" &&
    ["book", "file", "layers"].includes(space.icon) &&
    typeof space.title === "string"
  );
}

export const allDocsSpaces = docsSpaces.filter(isDocsSpace);

export function getDocsSpace(pathname: string) {
  return (
    allDocsSpaces.find(
      (space) =>
        pathname === space.href || pathname.startsWith(`${space.href}/`),
    ) ?? allDocsSpaces[0]
  );
}

export function withDocsSpace(url: string | undefined, docsSpace: string) {
  if (!url) return docsSpace;
  return url.replace(/^\/docs(?=\/|$)/, docsSpace);
}
