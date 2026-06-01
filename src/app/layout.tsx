import "./global.css";
import type { Metadata } from "next";
import Script from "next/script";
import { getSiteTheme } from "@/lib/theme";
import { themeStyle } from "@/lib/theme-style";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://docs.kanarinetwork.site",
  ),
  title: {
    default: "Kanari Docs",
    template: "%s | Kanari Docs",
  },
  description:
    "Official documentation for Kanari Network - A High-Performance Event-Driven Ledger for Web5 Infrastructure. Powered by MoveVM and Post-Quantum Cryptography (PQC), providing a sub-0.1s secure data plane for Web2 integration and verifiable resource management.",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export default function Layout({ children }: LayoutProps<"/">) {
  const theme = getSiteTheme();
  const themeVariables = {
    ...themeStyle(theme.light, "light"),
    ...themeStyle(theme.dark, "dark"),
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body style={themeVariables}>
        <Script id="theme-mode" strategy="beforeInteractive">
          {`(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);}catch(e){}})();`}
        </Script>
        <main className="site-shell">
          <div className="site-noise" />
          {children}
        </main>
      </body>
    </html>
  );
}
