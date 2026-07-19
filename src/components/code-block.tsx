"use client";

import { Check, Copy } from "lucide-react";
import {
  type HTMLAttributes,
  isValidElement,
  type ReactNode,
  useMemo,
  useState,
} from "react";
import { MermaidDiagram } from "@/components/mermaid-diagram";

function textFromNode(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(textFromNode).join("");
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return textFromNode(node.props.children);
  }

  return "";
}

function isMermaidNode(node: ReactNode): boolean {
  if (isValidElement<{ className?: string; children?: ReactNode }>(node)) {
    const className = node.props.className ?? "";
    if (className.split(/\s+/).includes("language-mermaid")) return true;
    return isMermaidNode(node.props.children);
  }

  if (Array.isArray(node)) return node.some(isMermaidNode);

  return false;
}

export function CodeBlock({
  children,
  ...props
}: HTMLAttributes<HTMLPreElement>) {
  const [copied, setCopied] = useState(false);
  const code = useMemo(() => textFromNode(children).trimEnd(), [children]);
  const mermaid = useMemo(() => isMermaidNode(children), [children]);

  if (mermaid) {
    return <MermaidDiagram code={code} />;
  }

  async function copyCode() {
    if (!code) return;

    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div className="docs-code-frame">
      <button
        aria-label={copied ? "Copied code" : "Copy code"}
        className="docs-code-copy"
        onClick={copyCode}
        type="button"
      >
        {copied ? (
          <Check aria-hidden="true" size={16} />
        ) : (
          <Copy aria-hidden="true" size={16} />
        )}
      </button>
      <pre {...props} className="docs-code-block">
        {children}
      </pre>
    </div>
  );
}
