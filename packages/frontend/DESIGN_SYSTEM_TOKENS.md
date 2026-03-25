# DESIGN_SYSTEM_TOKENS.md

## Purpose

This document defines the canonical design tokens for the frontend.

These tokens implement the OKX-inspired visual system in an engineering-friendly way.

---

## Token Architecture

There are 3 layers:

1. **CSS variables**
   - actual theme values
2. **Tailwind semantic tokens**
   - developer-facing utilities
3. **UI components**
   - reusable application primitives

---

## Typography Tokens

### Font Family

Primary font:

- `HarmonyOS Sans`

Fallback stack:

- `-apple-system`
- `BlinkMacSystemFont`
- `Segoe UI`
- `Roboto`
- `sans-serif`

### Tailwind Mapping

- `font-sans`

### Rule

All product UI should use `font-sans` unless there is an explicit exception.

---

## Surface Tokens

### CSS Variables

- `--bg-primary`
- `--bg-secondary`
- `--bg-tertiary`
- `--bg-hover`
- `--bg-input`

### Tailwind Mapping

- `bg-background`
- `bg-background-secondary`
- `bg-background-tertiary`

### Usage

- page background → `bg-background`
- card/panel background → `bg-background-secondary`
- inner control background → `bg-background-tertiary`

---

## Text Tokens

### CSS Variables

- `--text-primary`
- `--text-secondary`
- `--text-tertiary`
- `--text-muted`

### Tailwind Mapping

- `text-foreground`
- `text-foreground-secondary`
- `text-foreground-tertiary`
- `text-foreground-muted`

### Usage

- important labels/values → `text-foreground`
- supporting text → `text-foreground-secondary`
- metadata/helper text → `text-foreground-tertiary`
- disabled/low-emphasis text → `text-foreground-muted`

---

## Border Tokens

### CSS Variables

- `--border-primary`
- `--border-secondary`
- `--border-hover`

### Tailwind Mapping

- `border-border`
- `border-border-secondary`
- `border-border-hover`

### Usage

- default component border → `border-border`
- subtle separators → `border-border-secondary`
- focused/interactive border → `border-border-hover`

---

## Semantic Action Tokens

### Success / Buy

CSS variables:

- `--color-buy`
- `--color-buy-hover`
- `--color-buy-light`

Tailwind mapping:

- `text-success`
- `bg-success`
- `bg-success-hover`
- `bg-success-light`

Usage:

- buy buttons
- positive change
- profit indicators
- active buy-side accents

### Danger / Sell

CSS variables:

- `--color-sell`
- `--color-sell-hover`
- `--color-sell-light`

Tailwind mapping:

- `text-danger`
- `bg-danger`
- `bg-danger-hover`
- `bg-danger-light`

Usage:

- sell buttons
- negative change
- risk states
- destructive actions

---

## Radius Tokens

### Tailwind Tokens

- `rounded-lg`
- `rounded-xl`
- `rounded-2xl`

### Usage Guidance

- standard controls → `rounded-lg`
- cards and panels → `rounded-xl`
- dialogs / special surfaces → `rounded-2xl`

---

## Type Scale

### Tailwind Tokens

- `text-xs`
- `text-sm`
- `text-base`
- `text-lg`
- `text-xl`
- `text-2xl`
- `text-3xl`

### Usage Guidance

- metadata / table labels → `text-xs`
- secondary UI text → `text-sm`
- default body text → `text-base`
- card titles / section headers → `text-lg`
- page-level emphasis → `text-xl` to `text-3xl`

---

## Spacing Tokens

Use Tailwind spacing scale only.

Common allowed spacing:

- `1`
- `2`
- `3`
- `4`
- `6`
- `8`
- `10`
- `12`

Prefer standard spacing classes:

- `p-3`
- `p-4`
- `p-6`
- `gap-2`
- `gap-3`
- `gap-4`
- `space-y-2`
- `space-y-3`
- `space-y-4`

---

## Motion Tokens

### Duration

- `duration-200`

### Rule

Default interaction timing should be subtle and fast.
Avoid long decorative animation unless product value is clear.

### Accessibility

Always respect reduced motion preferences.

---

## Theme Definitions

### Dark Theme

Canonical dark values are defined in `:root`.

### Light Theme

Overrides live in `[data-theme='light']`.

### Rule

Do not define separate ad hoc dark/light colors in component files.

---

## Component Token Usage

### Button

Should consume:

- typography tokens
- radius tokens
- semantic action tokens
- border tokens
- focus ring tokens

### Input

Should consume:

- input background tokens
- border tokens
- text tokens
- error semantic tokens

### Card

Should consume:

- secondary background
- primary border
- title/body text tokens

### Modal

Should consume:

- secondary background
- border
- radius
- shadow
- accessible focus behavior

---

## Token Governance

### When Adding a New Token

Ask:

1. Is this really a new design concept?
2. Can an existing token already express it?
3. Will it be reused?
4. Is it aligned with the OKX-inspired system?

If the answer is "no" to reuse or system value, do not add it.

### Token Addition Rule

Add tokens only when they represent a stable, reusable visual concept.

---

## Implementation Examples

### Good

```tsx
<Card className="bg-background-secondary border-border">
  <div className="text-foreground">Balance</div>
  <div className="text-foreground-secondary">Available</div>
</Card>
```

### Avoid

```tsx
<div className="bg-[var(--bg-secondary)] border-[var(--border-primary)] text-[var(--text-primary)]">
  ...
</div>
```

unless integration constraints require it.
