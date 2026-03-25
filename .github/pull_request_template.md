# Pull Request

## Summary
<!-- Brief description of changes -->

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Refactoring
- [ ] Documentation update

---

## ⚠️ Design System Compliance Checklist

Before requesting review, confirm:

### Color Usage
- [ ] No hardcoded hex colors (e.g., `bg-[#25A750]`)
- [ ] Using semantic tokens: `bg-success`, `bg-danger`, `bg-background`
- [ ] No inline styles with colors (e.g., `style={{ color: '#fff' }}`)

### Typography
- [ ] Using `font-sans` (no custom `font-family` declarations)
- [ ] No external font imports added

### Components
- [ ] Using shared UI primitives from `src/components/ui/*`
- [ ] No duplicate button/input/card styles in page components

### Tailwind
- [ ] Using semantic classes: `bg-background`, `text-foreground`, `border-border`
- [ ] Avoided `bg-[var(--...)]` syntax unless absolutely necessary
- [ ] No arbitrary values without justification (e.g., `p-[13px]`)

### Theme
- [ ] Colors defined in CSS variables, not hardcoded
- [ ] Light/dark theme compatible

---

## Review Notes
<!-- Any specific areas needing attention -->

## Screenshots (if UI changes)
<!-- Before/after screenshots -->

## Related Issues
<!-- Link to related issues -->

---

**Reviewer Checklist:**
- [ ] Design system compliance verified
- [ ] No unauthorized color changes
- [ ] Font strategy followed (system font stack)
- [ ] Accessibility maintained
