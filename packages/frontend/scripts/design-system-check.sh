#!/bin/bash
# Design System Compliance Checker
# Run this before committing to ensure compliance

set -e

echo "🔍 CatSwap Design System Compliance Check"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

cd "$(dirname "$0")/.."

ERRORS=0

# ============================================
# Check 1: Hardcoded Colors
# ============================================
echo "1️⃣  Checking for hardcoded hex colors..."

HARDOCODED=$(grep -r "className.*\[#" src --include="*.tsx" | grep -E "(bg-|text-|border-).*\[#[0-9a-fA-F]{3,6}\]" || true)

if [ -n "$HARDOCODED" ]; then
    echo "${RED}❌ Found hardcoded colors:${NC}"
    echo "$HARDOCODED"
    echo ""
    echo "Fix: Use semantic tokens like bg-success, text-foreground"
    ERRORS=$((ERRORS + 1))
else
    echo "${GREEN}✅ No hardcoded colors found${NC}"
fi

echo ""

# ============================================
# Check 2: Forbidden Font Imports
# ============================================
echo "2️⃣  Checking for external font imports..."

FONT_IMPORTS=$(grep -r "@import.*font" src --include="*.css" | grep -v "DESIGN_SYSTEM" | grep -v "Font Stack" || true)

if [ -n "$FONT_IMPORTS" ]; then
    echo "${RED}❌ Found font imports:${NC}"
    echo "$FONT_IMPORTS"
    ERRORS=$((ERRORS + 1))
else
    echo "${GREEN}✅ No unauthorized font imports${NC}"
fi

echo ""

# ============================================
# Check 3: Direct CSS Variable Usage
# ============================================
echo "3️⃣  Checking CSS variable usage..."

VAR_COUNT=$(grep -r "var(--" src --include="*.tsx" | grep -c "className" || echo "0")

if [ "$VAR_COUNT" -gt 20 ]; then
    echo "${YELLOW}⚠️  Found $VAR_COUNT uses of var(--...) in className${NC}"
    echo "Consider using semantic classes: bg-background, text-foreground"
else
    echo "${GREEN}✅ Acceptable CSS variable usage ($VAR_COUNT)${NC}"
fi

echo ""

# ============================================
# Check 4: Font Family Overrides
# ============================================
echo "4️⃣  Checking for font-family overrides..."

FONT_OVERRIDES=$(grep -r "fontFamily" src --include="*.tsx" --include="*.css" | grep -v "font-sans" | grep -v "DESIGN_SYSTEM" || true)

if [ -n "$FONT_OVERRIDES" ]; then
    echo "${YELLOW}⚠️  Found potential font-family overrides:${NC}"
    echo "$FONT_OVERRIDES"
else
    echo "${GREEN}✅ No font-family overrides found${NC}"
fi

echo ""
echo "=========================================="

if [ $ERRORS -eq 0 ]; then
    echo "${GREEN}✅ All design system checks passed!${NC}"
    exit 0
else
    echo "${RED}❌ Found $ERRORS violation(s)${NC}"
    echo ""
    echo "Refer to:"
    echo "  - DESIGN_SYSTEM.md (principles)"
    echo "  - DESIGN_SYSTEM_TOKENS.md (token mappings)"
    exit 1
fi
