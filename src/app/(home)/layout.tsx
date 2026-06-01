import { SiteShell } from "@/components/site-chrome";
import { getDocsSpaces } from "@/lib/docs-spaces";

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <SiteShell docsSpaces={getDocsSpaces()}>
      {children}
    </SiteShell>
  );
}
