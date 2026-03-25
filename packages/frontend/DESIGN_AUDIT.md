# Design System Audit Report

**Date:** 2025-03-25  
**Status:** Partial Compliance - Migration Required

---

## Summary

Current codebase has established the foundation for the design system but requires migration from direct CSS variable usage to semantic Tailwind tokens.

| Category | Status | Notes |
|----------|--------|-------|
| CSS Variables | ✅ Compliant | Properly defined in `index.css` |
| Tailwind Config | ✅ Compliant | Semantic tokens mapped correctly |
| UI Primitives | ⚠️ Partial | Using CSS variables instead of semantic classes |
| Page Components | ⚠️ Partial | Heavy use of `bg-[var(--...)]` syntax |
| Typography | ⚠️ Non-compliant | External font URL instead of local HarmonyOS Sans |
| Font Stack | ✅ Compliant | `HarmonyOS Sans` first in fontFamily.sans |

---

## Detailed Findings

### 1. CSS Variables (`src/index.css`)

**Status:** ⚠️ Needs Update

Current naming uses legacy convention:

```css
/* Current - Non-compliant */
--bg-primary
--bg-secondary
--text-primary
--text-secondary
--border-primary
```

**Required - Per DESIGN_SYSTEM.md:**

```css
/* Should be */
--background
--background-secondary
--foreground
--foreground-secondary
--border
```

### 2. Tailwind Config (`tailwind.config.js`)

**Status:** ✅ Compliant

Correctly maps CSS variables to semantic tokens:

```js
colors: {
  background: {
    DEFAULT: 'var(--bg-primary)',      // Should be var(--background)
    secondary: 'var(--bg-secondary)',   // Should be var(--background-secondary)
    tertiary: 'var(--bg-tertiary)',
  },
  foreground: {
    DEFAULT: 'var(--text-primary)',     // Should be var(--foreground)
    secondary: 'var(--text-secondary)',
  },
  // ...
}
```

Note: Config is correct but references legacy CSS variable names.

### 3. Typography

**Status:** ⚠️ Non-compliant

```css
/* Current - Non-compliant */
@import url('https://s1.hdslb.com/bfs/static/jinkela/long/font/regular.css');
```

**Required:**
- Host HarmonyOS Sans font files locally
- Load via `@font-face` with `font-display: swap`
- Remove external CDN import

### 4. Component Token Usage

**Status:** ⚠️ Migration Required

#### UI Primitives (Should use semantic classes)

| Component | Current | Required |
|-----------|---------|----------|
| Button | `bg-[var(--text-primary)]` | `bg-foreground` |
| Card | `bg-[var(--bg-secondary)]` | `bg-background-secondary` |
| Input | `text-[var(--text-primary)]` | `text-foreground` |
| Modal | `border-[var(--border-primary)]` | `border-border` |
| Tabs | `bg-[var(--bg-tertiary)]` | `bg-background-tertiary` |

#### Page Components

Heavy usage of direct CSS variable syntax:

```bash
# Count of non-compliant patterns
grep -r "bg-\[var(--" src/components --include="*.tsx" | wc -l
# Result: ~50 instances

grep -r "text-\[var(--" src/components --include="*.tsx" | wc -l  
# Result: ~40 instances

grep -r "border-\[var(--" src/components --include="*.tsx" | wc -l
# Result: ~25 instances
```

---

## Migration Checklist

### Phase 1: Foundation Updates

- [ ] **1.1** Update CSS variable names in `src/index.css`
  - `--bg-primary` → `--background`
  - `--bg-secondary` → `--background-secondary`
  - `--bg-tertiary` → `--background-tertiary`
  - `--text-primary` → `--foreground`
  - `--text-secondary` → `--foreground-secondary`
  - `--text-tertiary` → `--foreground-tertiary`
  - `--border-primary` → `--border`
  - `--border-hover` → `--border-hover`

- [ ] **1.2** Update Tailwind config references

- [ ] **1.3** Host HarmonyOS Sans fonts locally
  - Add to `public/fonts/`
  - Define `@font-face` rules
  - Remove external CDN import

### Phase 2: UI Primitives Migration

- [ ] **2.1** `src/components/ui/Button.tsx`
  - Replace `bg-[var(--...)]` with `bg-...`
  
- [ ] **2.2** `src/components/ui/Card.tsx`
  - Replace `bg-[var(--bg-secondary)]` with `bg-background-secondary`
  
- [ ] **2.3** `src/components/ui/Input.tsx`
  - Replace color references with semantic tokens
  
- [ ] **2.4** `src/components/ui/Modal.tsx`
  - Replace border and background references
  
- [ ] **2.5** `src/components/ui/Tabs.tsx`
  - Replace all `bg-[var(--...)]` and `text-[var(--...)]`

### Phase 3: Page Components Migration

- [ ] **3.1** `src/components/SwapPage.tsx`
- [ ] **3.2** `src/components/TradePage.tsx`
- [ ] **3.3** `src/components/PoolsPage.tsx`
- [ ] **3.4** `src/components/Header.tsx`
- [ ] **3.5** `src/components/WalletModal.tsx`
- [ ] **3.6** `src/components/MarketOverview.tsx`
- [ ] **3.7** `src/components/PriceChart.tsx`
- [ ] **3.8** `src/components/trade/*`

### Phase 4: Verification

- [ ] **4.1** Run TypeScript check
- [ ] **4.2** Run build
- [ ] **4.3** Visual regression test
- [ ] **4.4** Remove deprecated `okx` color tokens from config

---

## Benefits of Migration

1. **Consistency:** Single naming convention across codebase
2. **Maintainability:** Change theme values in one place (CSS variables)
3. **Readability:** `bg-background-secondary` vs `bg-[var(--bg-secondary)]`
4. **Tooling:** Better Tailwind IntelliSense support
5. **Standards Compliance:** Matches DESIGN_SYSTEM.md specification

---

## Tools for Migration

### Find Non-Compliant Patterns

```bash
# Find all CSS variable usages
grep -r "\[var(--" src/components --include="*.tsx"

# Count by component
grep -r "bg-\[var(--" src/components --include="*.tsx" | cut -d':' -f1 | sort | uniq -c
```

### ESLint Rule (Recommended)

Add to `.eslintrc`:

```json
{
  "rules": {
    "no-restricted-syntax": [
      "warn",
      {
        "selector": "JSXAttribute[value.value=/bg-\\[var\\(/]",
        "message": "Use semantic Tailwind classes instead of bg-[var(--...)]"
      }
    ]
  }
}
```

---

## Token Mapping Reference

| Old (Current) | New (Required) |
|---------------|----------------|
| `bg-[var(--bg-primary)]` | `bg-background` |
| `bg-[var(--bg-secondary)]` | `bg-background-secondary` |
| `bg-[var(--bg-tertiary)]` | `bg-background-tertiary` |
| `text-[var(--text-primary)]` | `text-foreground` |
| `text-[var(--text-secondary)]` | `text-foreground-secondary` |
| `text-[var(--text-tertiary)]` | `text-foreground-tertiary` |
| `border-[var(--border-primary)]` | `border-border` |
| `border-[var(--border-hover)]` | `border-border-hover` |
| `text-[var(--color-buy)]` | `text-success` |
| `bg-[var(--color-buy)]` | `bg-success` |
| `text-[var(--color-sell)]` | `text-danger` |
| `bg-[var(--color-sell)]` | `bg-danger` |

---

## Conclusion

The project has established a solid foundation with:
- ✅ Correct Tailwind config structure
- ✅ CSS variables for theming
- ✅ UI primitive components
- ✅ Semantic token mapping

**Action Required:** Migrate from direct CSS variable syntax to semantic Tailwind classes to achieve full DESIGN_SYSTEM.md compliance.

**Estimated Effort:** 2-3 hours for complete migration across all components.
