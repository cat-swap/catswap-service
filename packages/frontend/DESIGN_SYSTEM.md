# DESIGN_SYSTEM.md

## Purpose

This frontend follows **OKX-inspired visual standards** for typography, color, density, spacing, and interaction patterns.

Our engineering goal is not only to make pages look like OKX, but to make that consistency **sustainable, scalable, and maintainable** as the project grows.

The core rule is:

> **OKX is the design reference.  
> Tailwind design tokens + CSS variables + UI components are the implementation system.**

We must avoid multiple parallel styling systems that drift over time.

---

## Core Principles

### 1. Single Source of Truth

All core visual decisions must come from a single design system pipeline:

- **`src/index.css`**
  - `@font-face`
  - theme CSS variables
  - minimal base/reset styles
- **`tailwind.config.js`**
  - maps CSS variables into semantic Tailwind tokens
- **`src/components/ui/*`**
  - reusable UI primitives
- **feature/page components**
  - compose UI primitives and layouts
  - do not redefine the visual system

Do **not** maintain multiple parallel naming systems for the same concept.

Bad examples:

- `--bg-primary`
- `okx.dark.bg`
- `.bg-primary-okx`
- hardcoded `bg-[#141414]`

for the same visual meaning.

There should be one canonical token path.

---

## Typography

### Required Font

The project must use **HarmonyOS Sans** to remain visually aligned with OKX.

### Rules

- `HarmonyOS Sans` must be the first font in `tailwind.config.js -> theme.extend.fontFamily.sans`
- global font setup must be defined in `src/index.css`
- components and pages should use `font-sans`
- avoid repeating raw `font-family` declarations in feature components

### Recommended Setup

- host font files locally
- load via `@font-face`
- use `font-display: swap`

### Do

- use `font-sans`
- rely on shared font tokens

### Don't

- import fonts from random external URLs unless explicitly approved
- redefine `font-family` in page components

---

## Color System

### Design Intent

Colors must reflect the OKX-inspired product language:

- dark/light theme surfaces
- layered backgrounds
- high-contrast primary text
- muted secondary/tertiary text
- green for buy/success
- red for sell/danger

### Implementation Rule

Colors are defined in CSS variables first, then mapped into semantic Tailwind tokens.

### Canonical Token Groups

- `background`
- `foreground`
- `border`
- `success`
- `danger`

### Example Semantic Usage

Prefer:

- `bg-background`
- `bg-background-secondary`
- `bg-background-tertiary`
- `text-foreground`
- `text-foreground-secondary`
- `text-foreground-tertiary`
- `border-border`
- `text-success`
- `bg-success`
- `text-danger`
- `bg-danger`

Avoid overusing:

- `bg-[var(--bg-primary)]`
- `text-[var(--text-primary)]`
- `border-[var(--border-primary)]`

These are allowed only in exceptional cases.

---

## Theme System

### Rule

Theme values must live in CSS variables.

Typical location:

- `:root`
- `[data-theme='light']`
- optionally `[data-theme='dark']`

### Rule of Responsibility

- CSS variables define actual values
- Tailwind exposes semantic class names
- components consume semantic classes
- pages should not manually reconstruct theme behavior

### Do

- toggle themes using `data-theme`
- keep token names stable

### Don't

- redefine dark/light values inside component files
- duplicate the same theme values in multiple places

---

## Tailwind Usage Rules

### Preferred Order

1. semantic Tailwind utility classes
2. shared UI component variants
3. direct CSS variable syntax only when necessary

### Good

```tsx
<div className="bg-background-secondary text-foreground border border-border" />
```

### Acceptable Only When Necessary

```tsx
<Line stroke="var(--color-buy)" />
```

### Avoid

```tsx
<div className="bg-[var(--bg-secondary)] text-[var(--text-primary)] border-[var(--border-primary)]" />
```

when equivalent semantic token classes already exist.

### Why

Semantic classes:

- improve readability
- reduce drift
- make global refactors easier
- keep implementation consistent across the codebase

---

## UI Component Layer

### Required Shared Primitives

All common UI patterns should be implemented in `src/components/ui/*`.

Expected primitives include:

- Button
- Input
- Card
- Modal
- Tabs

Additional primitives may include:

- Badge
- DropdownMenu
- Tooltip
- Select
- Table
- Skeleton

### Rules

- feature pages should use shared primitives by default
- visual variants belong in the primitive, not duplicated in pages
- if a new repeated pattern appears twice or more, consider promoting it into `ui/`

### Good

- add a `buy` variant to Button
- add a `compact` variant to Card

### Bad

- manually rebuild the same button styles in 4 pages
- manually rebuild card shell styles in every feature module

---

## Page and Feature Responsibilities

### Pages/Features Should Do

- compose layouts
- connect data/state
- wire interactions
- assemble feature-specific sections

### Pages/Features Should Not Do

- redefine typography scale
- redefine base spacing rules
- redefine button/input/card styling
- hardcode repeated colors or radii
- introduce new token naming systems

### Allowed Exceptions

Direct CSS variables are acceptable in these cases:

#### 1. Third-Party Library Configuration

Examples:

- recharts
- canvas/chart config
- inline SVG styles
- dynamic runtime styles

Example:

```tsx
<Line stroke="var(--color-buy)" />
```

#### 2. Global Browser Styling

Examples:

- scrollbar
- selection
- focus ring defaults
- base body/html rules

#### 3. Truly Dynamic Runtime Values

When Tailwind static class generation is not appropriate.

These should remain exceptions, not the default style authoring pattern.

---

## Spacing, Radius, Density

### Rule

Spacing, border radius, font size, and transition timing should come from Tailwind theme tokens, not arbitrary one-off values.

### Prefer

- `rounded-lg`
- `rounded-xl`
- `text-sm`
- `text-base`
- `gap-2`
- `gap-4`
- `p-4`
- `duration-200`

### Avoid

repeated arbitrary values unless genuinely necessary:

- `rounded-[11px]`
- `p-[13px]`
- `text-[15px]`

Use arbitrary values only when there is a strong design reason and no token should exist.

---

## Accessibility Requirements

Because OKX-style UI tends to be dense and interaction-heavy, accessibility must be enforced at the design-system level.

### Required

- visible keyboard focus
- correct semantic roles
- `aria-*` where appropriate
- accessible modal behavior
- accessible dropdown behavior
- accessible tabs behavior
- contrast-safe text/surface combinations

### Rule

Accessibility must be built into shared components, not repeatedly patched in pages.

---

## Migration Policy

### For Existing Legacy Code

Legacy styles may exist temporarily, but must be treated as transitional.

### Migration Priorities

- replace duplicated old classes with semantic Tailwind classes
- replace repeated shells with shared UI primitives
- remove deprecated legacy utilities after migration is complete

### Deprecated Patterns

Examples of patterns we should phase out:

- `*-okx` utility naming
- duplicated `.btn-*` systems outside shared components
- page-local formatting helpers duplicated across files
- repeated `bg-[var(--...)]` `text-[var(--...)]` bundles

---

## PR Review Checklist

Before merging, reviewers should check:

- Does this add a new visual pattern that should be a shared component?
- Does this duplicate an existing token or variant?
- Does this use semantic Tailwind classes where possible?
- Does this bypass the design system without a good reason?
- Does this introduce hardcoded colors, fonts, or spacing?
- Does it preserve OKX-aligned visual consistency?
- Does it keep theme behavior centralized?
- Does it maintain keyboard and screen-reader accessibility?

---

## Decision Rules

When choosing between options, follow this order:

1. Match OKX visual intent
2. Keep one implementation path
3. Prefer semantic tokens over raw values
4. Prefer shared primitives over page-local styling
5. Prefer maintainability over short-term convenience

---

## Short Version

- Follow OKX visually
- Implement through one design system
- Keep fonts/colors/tokens centralized
- Use Tailwind semantic tokens
- Build shared UI primitives
- Avoid dual-track styling systems
- Optimize for long-term consistency

---

## Project Standard

We do not want a codebase that merely "looks like OKX today".

We want a **design system** that can continue to look like OKX correctly as the product grows.
