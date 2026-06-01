import { notFound } from "next/navigation";
import { DocsShell } from "@/components/site-chrome";
import { getDocsSpaces } from "@/lib/docs-spaces";
import { getDocNav } from "@/lib/source";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ docsSpace: string }>;
}) {
  const { docsSpace } = await params;
  const docsSpaces = getDocsSpaces();
  const currentSpace = docsSpaces.find(
    (space) => space.href === `/${docsSpace}`,
  );
  if (!currentSpace) notFound();

  return (
    <DocsShell
      docsSpaces={docsSpaces}
      nav={getDocNav(docsSpace)}
      theme={currentSpace.theme}
    >
      {children}
    </DocsShell>
  );
}
