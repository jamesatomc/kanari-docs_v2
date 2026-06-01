import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { getDocsSpaces } from "@/lib/docs-spaces";

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <div className="site-shell">
      <div className="site-noise" />
      <SiteHeader docsSpaces={getDocsSpaces()} />
      {children}
      <SiteFooter />
    </div>
  );
}
