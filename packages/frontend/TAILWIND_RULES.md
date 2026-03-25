# TAILWIND_RULES.md

## Purpose

This document defines how Tailwind must be used in this project.

The goal is to keep the frontend visually aligned with OKX while ensuring long-term maintainability, consistency, and scalability.

---

## Core Rule

> Prefer semantic design-system classes over raw implementation details.

Use Tailwind as the primary styling interface for product code.

---

## Styling Priority

When writing styles, follow this order:

1. shared UI components in `src/components/ui/*`
2. semantic Tailwind tokens from `tailwind.config.js`
3. direct CSS variable usage only when necessary
4. inline styles only for runtime-only cases

---

## Allowed Patterns

### 1. Semantic Color Classes

Prefer:

- `bg-background`
- `bg-background-secondary`
- `bg-background-tertiary`
- `text-foreground`
- `text-foreground-secondary`
- `text-foreground-tertiary`
- `text-foreground-muted`
- `border-border`
- `border-border-secondary`
- `text-success`
- `bg-success`
- `bg-success-light`
- `text-danger`
- `bg-danger`
- `bg-danger-light`

### 2. Shared Typography and Layout Tokens

Prefer standard theme tokens:

- `font-sans`
- `text-xs`
- `text-sm`
- `text-base`
- `text-lg`
- `text-xl`
- `text-2xl`
- `rounded-lg`
- `rounded-xl`
- `rounded-2xl`
- `gap-2`
- `gap-3`
- `gap-4`
- `p-2`
- `p-3`
- `p-4`
- `p-6`
- `duration-200`

### 3. Shared UI Variants

Prefer:

- `<Button variant="primary" />`
- `<Button variant="buy" />`
- `<Card />`
- `<Input />`
- `<Modal />`
- `<Tabs />`

---

## Discouraged Patterns

These should be reduced over time:

- `bg-[var(--bg-primary)]`
- `text-[var(--text-primary)]`
- `border-[var(--border-primary)]`
- repeated class bundles copied across files
- page-local button/card/input styling

These are not always forbidden, but should not be the default.

---

## Forbidden Patterns

Do not introduce:

- hardcoded hex colors in JSX classes
- new legacy utility naming like `*-okx`
- duplicate button/input/card shells in feature files
- multiple naming systems for the same token
- page-level font-family declarations
- random arbitrary spacing/radius values without justification

Bad examples:

```tsx
<div className="bg-[#141414] text-white rounded-[11px]" />
<button className="px-4 py-2 rounded-lg bg-black text-white" />
```

---

## When Raw CSS Variables Are Allowed

Direct `var(--...)` usage is allowed only in these cases:

### 1. Third-Party Libraries

Examples:

- Recharts
- canvas
- SVG config
- dynamic chart colors

### 2. Global CSS

Examples:

- body
- `:root`
- `[data-theme='light']`
- `::selection`
- scrollbar styles
- focus-visible defaults

### 3. Runtime Dynamic Values

If the value is not known at build time and Tailwind classes are impractical.

---

## Arbitrary Values

Use arbitrary values sparingly.

### Allowed

- layout exceptions with clear design reason
- library integration edge cases
- one-off responsive constraints

### Avoid

- arbitrary radius when a token exists
- arbitrary spacing when a token exists
- arbitrary color when a semantic token exists

Bad:

```tsx
rounded-[10px]
p-[13px]
text-[15px]
```

Good only if justified:

```tsx
grid-cols-[280px_1fr_360px]
```

---

## Component Rules

### Buttons

- always use shared `Button`
- add new variants in `Button.tsx`
- do not restyle primary/buy/sell buttons locally

### Inputs

- use shared `Input` where possible
- if a trading input needs special adornments, wrap `Input`, do not recreate it fully each time

### Cards

- use shared `Card`
- add composition helpers before duplicating shells

### Tabs

- use shared `Tabs`
- do not rebuild tab styles page by page

---

## Theming Rules

- theme values belong in CSS variables
- Tailwind classes should reference semantic tokens
- page components should not implement light/dark logic manually
- do not redefine theme colors inside feature CSS or JSX

---

## Font Rules

- use `font-sans`
- HarmonyOS Sans is the required primary typeface
- do not manually set page-level font stacks
- font loading must remain centralized

---

## Review Checklist

Before merging, confirm:

- semantic classes used where possible
- no new hardcoded colors
- no new duplicated component shells
- no new legacy utility system
- no unnecessary direct `var(--...)` usage
- design remains OKX-consistent
- accessibility is preserved

---

## Short Rule

If a style is part of the design language, it belongs in tokens or shared UI components, not in scattered page-level class strings.
