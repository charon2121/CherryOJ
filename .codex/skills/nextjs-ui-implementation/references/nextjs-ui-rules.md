# Next.js UI Rules

This reference condenses the project’s `frontend-design.md` into rules that are useful during implementation.

## 1. Architecture Defaults

- Prefer App Router.
- Prefer Server Components by default.
- Add `"use client"` only for interactive leaf components.
- Keep data fetching on the server unless the use case is truly client-driven.
- Use:
  - static fetch for SSG
  - `next: { revalidate: ... }` or `export const revalidate = ...` for ISR
  - `cache: "no-store"` or `export const dynamic = "force-dynamic"` for SSR

## 2. Required Next.js Primitives

### Fonts

- Use `next/font/google` or `next/font/local`.
- Expose fonts via CSS variables on `<html>`.
- Do not load fonts with `<link>` tags.

### Images

- Use `next/image`.
- Always give known dimensions or use `fill` with a sized relative parent.
- Mark critical hero imagery with `priority`.

### Metadata

- Use the Metadata API in `layout.tsx` or page files.
- Use `generateMetadata` for dynamic routes when needed.

### Navigation

- Use `next/link`.
- Use App Router navigation APIs from `next/navigation`.
- Do not mix Page Router and App Router APIs in the same implementation.

## 3. Styling Priorities

- Prefer the project’s existing styling system.
- When selecting a system for new work:
  1. Tailwind when already present or clearly favored
  2. CSS Modules for scoped component styling
  3. global CSS variables for design tokens

## 4. Design Quality Rules

- Start from a clear visual concept, not from a default template.
- Choose a deliberate tone: editorial, brutalist, retro-futurist, playful, luxurious, industrial, organic, and so on.
- Make layout choices that feel authored: asymmetry, strong spacing, layered backgrounds, intentional density or restraint.
- Avoid generic AI aesthetics:
  - default Inter/Roboto/system stacks
  - bland white pages with purple gradients
  - predictable dashboard compositions with no point of view

## 5. Typography and Color

- Pair display and body fonts intentionally.
- Use CSS variables for reusable color and spacing tokens.
- Choose a palette with clear contrast and a distinct accent strategy.
- Support dark mode only when it fits the product or the repo already supports it.

## 6. Motion and Atmosphere

- Use motion to reinforce hierarchy and page entry, not as decoration everywhere.
- Prefer a few high-impact moments such as staggered reveals, transitions, or ambient background movement.
- Use textured or layered backgrounds where appropriate to create atmosphere.

## 7. Performance Constraints

- Protect LCP by prioritizing above-the-fold media.
- Protect CLS with `next/font` and explicit image sizing.
- Protect INP by limiting client-side complexity.
- Split heavy client-only features with dynamic import when useful.

## 8. Delivery Standard

When shipping code:

- provide real file paths and runnable code
- include dependencies if new packages are required
- include config changes when needed
- preserve framework correctness while pushing design quality
