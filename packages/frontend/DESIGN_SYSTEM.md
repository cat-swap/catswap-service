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

### Acceptable when needed

```tsx
<div className="bg-[var(--bg-secondary)]" />
```

### Bad

```tsx
<div className="bg-[#141414]" />
<div style={{ backgroundColor: '#141414' }} />
```

---

## Component Patterns

### UI Primitives

Located in `src/components/ui/*`:

- Button
- Card
- Input
- Modal
- Tabs

These are the **only** components that should define low-level visual styling.

All other components should compose these primitives.

### Layout Components

Do not create one-off layout divs with complex styling.

Prefer:

- standardized layout patterns
- shared layout components if needed
- consistent spacing scales

### Do

- use `Card` for containers
- use `Button` with variants
- use `Input` for form fields

### Don't

- rewrite card styles in every page
- use raw `<button>` with custom classes
- use raw `<input>` without the Input component

---

## Spacing & Density

### Rule

Use Tailwind's spacing scale consistently.

Do not introduce arbitrary spacing values unless necessary.

### Preferred

- `p-4`, `m-6`, `gap-3`
- `px-6 py-4`

### Acceptable

- `h-[calc(100vh-64px)]` for specific layout needs

### Bad

- `style={{ padding: 12 }}`
- `className="p-[13px]"`

---

## File Structure

```
src/
├── components/
│   ├── ui/              # UI primitives (only styling definitions)
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── Tabs.tsx
│   ├── layout/          # Layout components
│   ├── features/        # Feature-specific components
│   └── ...
├── lib/
│   └── utils.ts         # cn() and other utilities
├── styles/
│   ├── index.css        # CSS variables, font-face, reset
│   └── ...
├── tailwind.config.js   # Token mappings
└── ...
```

---

## Naming Conventions

### CSS Variables

- `--background`: base background
- `--background-secondary`: elevated surfaces
- `--background-tertiary`: inputs, hover states
- `--foreground`: primary text
- `--foreground-secondary`: secondary text
- `--foreground-tertiary`: hints, placeholders
- `--border`: default borders
- `--border-hover`: interactive borders
- `--success`: buy, positive
- `--success-hover`: hover state
- `--danger`: sell, negative
- `--danger-hover`: hover state

### Tailwind Tokens

Mirror CSS variable names:

- `background.DEFAULT`
- `background.secondary`
- `background.tertiary`
- `foreground.DEFAULT`
- `foreground.secondary`
- `foreground.tertiary`
- `border.DEFAULT`
- `border.hover`
- `success.DEFAULT`
- `danger.DEFAULT`

---

## Migration Path

If you find non-compliant code:

1. Check if a UI primitive already exists
2. If yes, replace with the primitive
3. If no, consider adding to `src/components/ui/`
4. Update Tailwind config if new tokens are needed
5. Refactor to remove hardcoded values

---

## Enforcement

These rules are enforced through:

- code review
- TypeScript strict mode
- visual regression testing (planned)
- periodic design audits

When in doubt, prefer the pattern that:

1. uses fewer hardcoded values
2. relies on shared tokens
3. matches OKX visual language
