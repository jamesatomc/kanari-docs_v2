import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { getDocsSpaces } from "@/lib/docs-spaces";

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <>
      <SiteHeader docsSpaces={getDocsSpaces()} />
      {children}
      <SiteFooter />
    </>
  );
}
