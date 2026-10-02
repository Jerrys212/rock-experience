@AGENTS.md

## Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS v4 (config in `app/globals.css` via `@theme`, no `tailwind.config.js`)
- **Forms**: React Hook Form + Zod + Server Actions
- **Responsive**: Mobile First
- **Package Manager**: pnpm

## Commands

| Command                  | Description                  |
| ------------------------ | ---------------------------- |
| `pnpm install`           | Install dependencies         |
| `pnpm dev`               | Start dev server (port 3001) |
| `pnpm build`             | Production build             |
| `pnpm start`             | Run production build         |
| `pnpm lint`              | Run ESLint                   |
| `pnpm exec tsc --noEmit` | Type-check without emitting  |

> The `dev` script must include `-p 3000` (e.g. `"dev": "next dev -p 3000"`).

## Git Workflow

- Branches: `main` (production), `feature/*`, `fix/*`
- Commit messages in **English**, conventional commits (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`)
- Commits are authored by the repo owner only: **no `Co-Authored-By: Claude` trailer** or any other AI attribution in commit messages or PR descriptions
- Be descriptive about the "why", not just the "what"

## Project Structure

This is a **landing page**, so the architecture is **section-based**. The unit of organization is a visual block of the page, and copy lives apart from UI.

```
my-landing/
├── app/                          # Routes ONLY (App Router)
│   ├── layout.tsx                # Root layout: fonts, metadata, <main>, Navbar/Footer
│   ├── page.tsx                  # Composes sections, nothing else
│   ├── not-found.tsx
│   ├── sitemap.ts
│   ├── robots.ts
│   ├── globals.css               # Design tokens (@theme)
│   └── (legal)/
│       ├── privacy/page.tsx
│       └── terms/page.tsx
│
├── src/
│   ├── sections/                 # One folder per landing block
│   │   ├── hero/
│   │   │   ├── hero.tsx          # Section entry (Server Component)
│   │   │   └── hero-visual.tsx   # Subcomponents used only by this section
│   │   ├── features/
│   │   ├── pricing/
│   │   │   ├── pricing.tsx
│   │   │   └── billing-toggle.tsx  # "use client" leaf
│   │   ├── testimonials/
│   │   ├── faq/
│   │   └── cta/
│   │
│   ├── content/                  # Copy & data: texts, plans, FAQs, testimonials
│   │   ├── hero.ts
│   │   ├── pricing.ts
│   │   └── faq.ts
│   │
│   ├── components/
│   │   ├── ui/                   # Own primitives (Button, Badge…), built with Tailwind
│   │   └── layout/               # Navbar, Footer, Container, SectionHeading
│   │
│   ├── actions/                  # Server Actions ("use server")
│   │   └── contact/
│   │       ├── send-contact.ts
│   │       └── schema.ts
│   │
│   └── lib/
│       ├── utils.ts              # cn(), helpers
│       ├── env.ts                # Validated env (Zod)
│       ├── site.ts               # Site config: name, URL, socials, default SEO
│       └── analytics.ts
│
├── public/                       # Images, icons, OG image
├── next.config.ts
└── package.json
```

### Structure rules

- **`app/page.tsx` only composes sections** in order (`<Hero /> <Features /> <Pricing /> …`). No markup or logic there.
- **A section must not import from another section.** Anything shared goes to `src/components/` or `src/lib/`.
- **Subcomponents live inside their section folder** until a second section needs them; only then move them to `src/components/`.
- **Section variants** (e.g. a campaign hero) go in the same folder: `hero/hero-campaign.tsx`. Don't create a new section.
- **No hardcoded copy in components.** Texts, prices, lists, links and image paths live in `src/content/`, typed with `satisfies` or an explicit type, so copy can change (or move to a CMS / i18n) without touching UI.
- Don't create `hooks/`, `store/`, `context/` or `types/` folders preemptively. Add them only when something real needs them.

## Code Rules

### Naming

- **Files & folders**: `kebab-case`
- **React components**: `PascalCase` (file stays `kebab-case`)
- **Hooks**: `use-*` prefix

### TypeScript

- Strict mode always on. **No `any`**: use proper types or `unknown`.
- Check null/undefined and array lengths before access.

### Server vs Client Components

- **Default to Server Components.** Sections are server components.
- `"use client"` only for state, effects, browser APIs or event handlers (accordion, billing toggle, mobile menu, form). Isolate it in the **smallest leaf component** inside the section, never the whole section.
- **Mutations go through Server Actions**, never client-side fetch.

### Imports

- Use the `@/*` path alias for `src/` imports.
- Order: external packages → `@/` internal → relative.

### Environment Variables

- Client-exposed vars must be prefixed `NEXT_PUBLIC_*`.
- Validate all env vars in `src/lib/env.ts` with Zod and import from there, never `process.env` directly.

## Validation (Zod)

- **All user input goes through Zod.** No hand-written validation.
- **Infer types from schemas**: `type ContactInput = z.infer<typeof ContactSchema>`.
- **One schema, both layers**: the form uses `@hookform/resolvers/zod` and the Server Action re-validates with the same schema.
- Server Actions use `safeParse` and return field errors, never throw raw to the client:
  ```ts
  const parsed = ContactSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }
  ```
- If an external service is called (email provider, CRM, CMS), validate its response with Zod before using it.

## Error Handling & UX

- Handle errors explicitly in Server Actions; log with context, never expose internals.
- **User-facing messages in Spanish**, clear and actionable (e.g. "No pudimos enviar tu mensaje. Inténtalo de nuevo en unos minutos.").
- Forms must show loading, success and error states.

## Accessibility & Semantic HTML

- No component library: primitives are built in-house, so a11y is our responsibility.
- Every interactive element is keyboard-navigable, has a visible focus state and an accessible label.
- Prefer native elements before custom ones: `<button>` for actions, `<a>` for navigation, `<details>`/`<summary>` for the FAQ accordion, `<dialog>` for modals.
- Custom interactive widgets must expose the right ARIA state (`aria-expanded`, `aria-pressed`, `aria-controls`); e.g. the mobile menu toggle and the billing toggle.
- `<main>` is rendered once, in `app/layout.tsx`. Sections must not render their own `<main>`.
- **Each section is a `<section>`** with `aria-labelledby` pointing at its heading and an `id` for anchor navigation (`#pricing`, `#faq`).
- Use `<header>`, `<nav>`, `<footer>`, `<aside>` where they apply; `<div>` only for pure layout wrappers.
- **One `<h1>` per page** (in the hero); sections start at `<h2>`.
- Respect `prefers-reduced-motion` for animations.

## SEO & Performance

- Define `metadata` (title, description, Open Graph, Twitter) in `app/layout.tsx`, using defaults from `src/lib/site.ts`; override per page when needed.
- Keep `app/sitemap.ts` and `app/robots.ts` up to date.
- **Images**: always `next/image` with `alt`, explicit sizes and `sizes`; the hero image uses `priority`.
- **Fonts**: `next/font` only, no external font `<link>`.
- The page should be statically rendered. Don't add dynamic APIs (`cookies()`, `headers()`, uncached fetch) without a reason.
- Keep client JS minimal: avoid heavy animation libraries for effects CSS can do.

## Testing

- **E2E (Playwright)**: smoke test that the page renders, anchor navigation works and the contact form submits (success and validation error).
- **Unit (Vitest)**: only for Server Actions and non-trivial helpers. Co-locate as `*.test.ts`.
