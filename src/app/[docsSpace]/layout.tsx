import { notFound } from "next/navigation";
import { getDocsSpaces } from "@/lib/docs-spaces";

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

  return children;
}
