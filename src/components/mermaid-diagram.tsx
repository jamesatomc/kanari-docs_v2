"use client";

import { Copy, Minus, Plus } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";

function normalizeMermaidSource(source: string) {
  return source.trim().replace(/<br\s*\/?>/gi, "<br/>");
}

export function MermaidDiagram({ code }: { code: string }) {
  const rawId = useId();
  const diagramId = useMemo(
    () => `kanari-docs-mermaid-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`,
    [rawId],
  );
  const source = useMemo(() => normalizeMermaidSource(code), [code]);
  const [svg, setSvg] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const mounted = useRef(true);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mounted.current = true;

    async function renderDiagram() {
      try {
        const mermaid = (await import("mermaid")).default;
        const isDark = document.documentElement.classList.contains("dark");

        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "base",
          themeVariables: {
            background: "transparent",
            primaryColor: isDark ? "#20302b" : "#fffdf7",
            primaryTextColor: isDark ? "#f7f4eb" : "#111b18",
            primaryBorderColor: isDark ? "#c8f43d" : "#111b18",
            lineColor: isDark ? "#c8f43d" : "#7868da",
            secondaryColor: isDark ? "#17211e" : "#f7f4eb",
            tertiaryColor: isDark ? "#111b18" : "#eef4dc",
            clusterBkg: isDark ? "#111b18" : "#f7f4eb",
            clusterBorder: isDark ? "#c8f43d" : "#7868da",
            fontFamily: 'Inter, Arial, "Helvetica Neue", sans-serif',
          },
          flowchart: {
            curve: "basis",
            htmlLabels: true,
            padding: 18,
          },
        });

        const result = await mermaid.render(diagramId, source);
        if (!mounted.current) return;
        setSvg(result.svg);
        setError(null);
      } catch (cause) {
        if (!mounted.current) return;
        setSvg("");
        setError(cause instanceof Error ? cause.message : String(cause));
      }
    }

    renderDiagram();

    const observer = new MutationObserver(renderDiagram);
    observer.observe(document.documentElement, {
      attributeFilter: ["class"],
      attributes: true,
    });

    return () => {
      mounted.current = false;
      observer.disconnect();
    };
  }, [diagramId, source]);

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.innerHTML = svg;
    }
  }, [svg]);

  async function copySource() {
    await navigator.clipboard.writeText(source);
  }

  return (
    <figure className="docs-mermaid-frame">
      <div className="docs-mermaid-toolbar">
        <span>Mermaid diagram</span>
        <div className="docs-mermaid-actions">
          <button
            aria-label="Zoom out diagram"
            className="docs-mermaid-control"
            disabled={zoom <= 0.65}
            onClick={() => setZoom((value) => Math.max(0.65, value - 0.15))}
            type="button"
          >
            <Minus aria-hidden="true" size={15} />
          </button>
          <button
            aria-label="Reset diagram zoom"
            className="docs-mermaid-control docs-mermaid-control--zoom"
            onClick={() => setZoom(1)}
            type="button"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            aria-label="Zoom in diagram"
            className="docs-mermaid-control"
            disabled={zoom >= 2}
            onClick={() => setZoom((value) => Math.min(2, value + 0.15))}
            type="button"
          >
            <Plus aria-hidden="true" size={15} />
          </button>
          <button
            aria-label="Copy Mermaid source"
            className="docs-mermaid-control docs-mermaid-control--copy"
            onClick={copySource}
            type="button"
          >
            <Copy aria-hidden="true" size={15} />
            <span>Copy</span>
          </button>
        </div>
      </div>
      {error ? (
        <pre className="docs-mermaid-error">{error}</pre>
      ) : (
        <div className="docs-mermaid-scroll">
          <div
            className="docs-mermaid-canvas"
            ref={canvasRef}
            style={{ transform: `scale(${zoom})` }}
          />
        </div>
      )}
    </figure>
  );
}
