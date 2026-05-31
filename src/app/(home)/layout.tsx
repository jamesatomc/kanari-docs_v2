import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
