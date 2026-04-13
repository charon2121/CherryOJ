---
name: nextjs-ui-implementation
description: Implement production-grade UI in Next.js projects, especially App Router interfaces, layouts, dashboards, landing pages, admin panels, and reusable components. Use when Codex needs to turn a frontend requirement or design brief into polished Next.js code with strong visual direction, correct Server/Client Component boundaries, and disciplined use of next/font, next/image, metadata, and performance-aware patterns. Use this instead of a generic frontend skill when the task is specifically about building or refining the UI layer in a Next.js codebase.
---

# Nextjs Ui Implementation

## Overview

Implement distinctive, production-grade Next.js UI without falling into generic AI patterns. Favor App Router, keep React Server Components as the default, and treat design quality as a first-class engineering constraint.

## Workflow

1. Inspect the target codebase before coding.
   Confirm whether the project uses App Router or Page Router, what styling system is already present, how fonts and images are handled, and whether there is an existing design system that must be preserved.

2. Read the relevant design rules.
   Start with [references/nextjs-ui-rules.md](references/nextjs-ui-rules.md). If the repo already contains a design brief such as `frontend-design.md`, read that too and treat repo-local guidance as higher priority.

3. Lock the implementation direction before editing.
   Decide:
   - page or component scope
   - visual concept
   - server/client boundary
   - data-fetching mode: static, ISR, SSR, or client fetch
   - whether the task should preserve an existing visual language or intentionally introduce a new one

4. Implement complete code, not partial sketches.
   Provide real files, imports, metadata, and configuration changes needed to run. Keep interactive logic in leaf Client Components and keep parent layout/page shells as Server Components when possible.

5. Verify the result.
   Run the project’s lint/typecheck/build command when feasible. If verification is not possible, state that explicitly and note the likely risk surface.

## Implementation Rules

### Respect project reality

- Preserve an established design system when working inside an existing product.
- Introduce a new visual language only when the task is a greenfield page, feature, or explicit redesign.
- Reuse local primitives when they are already idiomatic for the repo.

### Default to App Router discipline

- Prefer `app/` and Server Components by default.
- Add `"use client"` only where interaction requires it.
- Push stateful behavior down to leaf components.
- Keep data fetching in Server Components unless the task is truly client-driven.

### Use Next.js-native primitives

- Load fonts with `next/font`, never raw `<link>` tags.
- Render images with `next/image`, never plain `<img>` for shipped UI.
- Use Metadata API for page metadata.
- Use `next/link` and App Router navigation APIs consistently.

### Design with intent

- Choose a strong visual direction instead of a safe default.
- Avoid interchangeable layouts, purple-on-white defaults, and generic SaaS gradients.
- Use typography, spacing, contrast, and background treatment to create a specific mood.
- Prefer a few meaningful visual moves over many weak ones.

### Optimize for shipped code

- Keep code legible and componentized.
- Use CSS variables for major tokens when building a new visual language.
- Avoid unnecessary client-side JS.
- Consider LCP, CLS, and bundle size when choosing implementation patterns.

## Deliverables

When implementing UI with this skill, make sure the result includes:

- complete file contents for each changed or created file
- correct Server/Client Component split
- font, image, and metadata handling aligned with Next.js best practices
- any required dependency or config updates
- concise verification notes

## References

- Read [references/nextjs-ui-rules.md](references/nextjs-ui-rules.md) for the condensed design and framework rules extracted from the source design brief.
- If a repo-local `frontend-design.md` exists, read it and treat it as the project-specific extension of this skill.
