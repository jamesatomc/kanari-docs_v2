# kanari-docs_v2

Next.js documentation site for Kanari Network.

The docs are rendered from local files in `content/docs` without Fumadocs.

## Development

```bash
bun run dev
```

Open http://localhost:3000.

## Structure

- `content/docs`: Markdown/MDX-like documentation files.
- `src/lib/source.ts`: Local filesystem docs loader.
- `src/components/markdown-renderer.tsx`: Lightweight renderer for the docs content.
- `src/app/docs`: Documentation routes and layout.
