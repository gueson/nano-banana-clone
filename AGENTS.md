# Repository Guidelines

## Project Structure & Module Organization

- `app/`: Next.js App Router entrypoints (`layout.tsx`, `page.tsx`) and app-level CSS (`globals.css`).
- `components/`: Feature/section components used by pages (e.g. `components/editor.tsx`).
- `components/ui/`: Shared UI primitives (shadcn-style) consumed by feature components.
- `hooks/`: Reusable React hooks (mirrors some `components/ui/*` hooks).
- `lib/`: Small utilities and shared helpers (e.g. `lib/utils.ts`).
- `public/`: Static assets served at the site root (icons, placeholders).
- `styles/`: Global styles (additional to `app/globals.css`).

Use the path alias `@/*` for imports from the repo root (configured in `tsconfig.json`).

## Build, Test, and Development Commands

This repo uses `pnpm` (see `pnpm-lock.yaml`).

- `pnpm install`: Install dependencies.
- `pnpm dev`: Run the local dev server (Next.js).
- `pnpm build`: Production build.
- `pnpm start`: Serve the production build locally.
- `pnpm lint`: Run the configured linter (currently `eslint .`).

## Coding Style & Naming Conventions

- TypeScript + React components live in `.tsx`; keep files small and composable.
- Indentation: 2 spaces; avoid semicolons (match existing files).
- Naming: `PascalCase` for React components (`export function Header()`), `kebab-case` for filenames (`theme-provider.tsx`).
- Styling: Tailwind CSS utility classes; prefer reusing `components/ui/*` primitives over one-off styles.

## Testing Guidelines

No automated test framework is configured in this workspace yet.

- For changes, run `pnpm build` and do a quick smoke test via `pnpm dev`.
- If you add tests, keep them near code (e.g. `components/__tests__/...`) and document the runner in `package.json`.

## Commit & Pull Request Guidelines

This folder does not include Git history (`.git/` is absent), so no existing commit conventions can be inferred.

- Use Conventional Commits (e.g. `feat: add crop tool`, `fix: handle empty image`).
- PRs should include: summary, screenshots/GIF for UI changes, and manual test notes (commands run + scenarios checked).

## Security & Configuration Tips

- Do not commit secrets. If environment variables are introduced, document them and provide a safe `.env.example`.
