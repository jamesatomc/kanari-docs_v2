import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import { getDocPage, getDocPages, getPageImage } from "@/lib/source";
import { getSiteTheme } from "@/lib/theme";

export const revalidate = false;

export async function GET(
  _req: Request,
  { params }: RouteContext<"/og/docs/[...slug]">,
) {
  const { slug } = await params;
  const page = getDocPage(slug.slice(0, -1));
  if (!page) notFound();
  const theme = getSiteTheme().light;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        color: theme.ink,
        background: `linear-gradient(135deg, ${theme.background} 0%, ${theme.secondary} 100%)`,
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          fontSize: 34,
          fontWeight: 900,
        }}
      >
        <div
          style={{
            width: 70,
            height: 70,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 999,
            color: theme.invertedText,
            background: theme.accent,
          }}
        >
          K
        </div>
        Kanari Docs
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            marginBottom: 18,
            color: theme.accentStrong,
            fontSize: 24,
            fontWeight: 900,
          }}
        >
          Documentation
        </div>
        <div
          style={{
            maxWidth: 920,
            fontSize: 76,
            fontWeight: 950,
            lineHeight: 0.95,
          }}
        >
          {page.title}
        </div>
        <div
          style={{
            maxWidth: 760,
            marginTop: 24,
            color: theme.muted,
            fontSize: 28,
          }}
        >
          {page.description}
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}

export function generateStaticParams() {
  return getDocPages().map((page) => ({
    slug: getPageImage(page).segments,
  }));
}
