import { DocsShell } from "@/components/site-chrome";
import { getDocNav } from "@/lib/source";

export default function Layout({ children }: LayoutProps<"/docs">) {
  return <DocsShell nav={getDocNav()}>{children}</DocsShell>;
}
