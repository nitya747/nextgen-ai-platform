# Next-Gen AI Platform Landing Page - Implementation Plan

This document outlines the detailed architecture and implementation strategy for building the premium, high-converting, and high-performance landing page for the AI-driven data automation platform (**Armory**), fully aligned with the constraints and scoring matrix from the official problem statement (`frontend_battle.pdf`).

---

## Technical Stack & Architecture

- **Core Framework**: React (Vite-based JS scaffold) initialized in [nextgen-ai-platform](file:///C:/Users/Nitya/.gemini/antigravity/scratch/nextgen-ai-platform).
- **Styling**: Vanilla CSS for layouts, fluid transitions, and premium dark-mode visuals.
- **Typography & Theme Integration** (sourced from `fonts.pdf`):
  - **Headers, Display Titles, Section Codes, and Code Blocks**: JetBrains Mono (configured via Google Fonts import).
  - **Body Text, Navigation Links, & Form UI Elements**: Inter (configured via Google Fonts import).
- **Color Palette (CSS Variables)** (sourced from `colorPallet.pdf`):
  - `--color-arctic-powder`: `#F1F6F4` (Light Gray Text/Containers)
  - `--color-forsythia`: `#FFC801` (Primary Bright Yellow-Gold Accent)
  - `--color-nocturnal-expedition`: `#114C5A` (Deep Teal Accent/Glows)
  - `--color-mystic-mint`: `#D9E8E2` (Soft Mint Highlights)
  - `--color-deep-saffron`: `#FF9932` (Secondary Orange Accent)
  - `--color-oceanic-noir`: `#172B36` (Primary Deep Dark Teal Background)
  - `--color-bg-primary`: var(--color-oceanic-noir)
  - `--color-bg-secondary`: `#11212B` (Slightly darker shade for elevated elements)
  - `--color-border-subtle`: `rgba(217, 232, 226, 0.1)` (Based on Mystic Mint opacity)

---

## User Review Required

Please review the custom state isolation and layout reflow strategies designed to achieve maximum points in the Phase 1 scoring matrix.

> [!IMPORTANT]
> **State Isolation for Pricing**: To satisfy the **Re-render & State Isolation Guardrail (15 pts)**, we will bypass React's standard re-rendering flow for pricing updates. We will store the selected currency and billing cycle states in a standard ref (or state within a highly isolated wrapper) and perform direct DOM updates to the price nodes via React `useRef` and `.textContent`. This guarantees zero global components reflow or layout thrashing.
>
> **Bento-to-Accordion Context Lock**: To satisfy the **Context Lock Constraint (10 pts)**, we will sync the desktop active hover index of the Bento Grid feature section with the mobile Accordion state using a window resize listener. If the viewport crosses the mobile breakpoint, the active bento card index will programmatically open the corresponding accordion panel.

---

## Open Questions

- **Flow Diagram Interactions**: The video shows a wireframe sphere that waves/distorts under the cursor. We will build this using a custom interactive SVG mesh with mouse-pointer displacement to avoid heavy WebGL dependencies and maintain perfect performance scores.
- **smoky background video**: The statistics section features a looping smokey fluid background. We will use a highly optimized CSS radial gradient glow combined with a looping video background or canvas particle wave to replicate this effect.

---

## Feature 1: Matrix-Driven Pricing & Performance-Isolated Switcher

### The Data Logic Matrix
We will define a multi-dimensional pricing matrix structure to dynamically calculate rates without hardcoded UI values:
```javascript
const PRICING_MATRIX = {
  currencies: {
    USD: { symbol: '$', rate: 1.0 },
    EUR: { symbol: '€', rate: 0.9 },
    INR: { symbol: '₹', rate: 80.0 }
  },
  tiers: {
    starter: { baseMonthly: 29 },
    pro: { baseMonthly: 79 },
    enterprise: { baseMonthly: 249 }
  },
  discount: 0.20 // Flat 20% annual discount multiplier
};
```

### The State Isolation Mechanism
- The parent component will **not** re-render when switching currency or billing.
- We will attach event listeners directly to the Currency dropdown and Billing toggle.
- Upon user interaction, we will trigger a direct DOM update method:
```javascript
// Example price update function
const updatePrices = (billingCycle, currency) => {
  const curr = PRICING_MATRIX.currencies[currency];
  const rate = curr.rate;
  const symbol = curr.symbol;
  
  Object.keys(PRICING_MATRIX.tiers).forEach(tierKey => {
    const tier = PRICING_MATRIX.tiers[tierKey];
    let price = tier.baseMonthly * rate;
    
    if (billingCycle === 'annual') {
      price = price * (1 - PRICING_MATRIX.discount); // Apply 20% discount
    }
    
    // Direct DOM text update without triggering React component render
    if (priceRefs.current[tierKey]) {
      priceRefs.current[tierKey].textContent = `${symbol}${Math.round(price)}`;
    }
    if (periodRefs.current[tierKey]) {
      periodRefs.current[tierKey].textContent = billingCycle === 'annual' ? '/mo, billed annually' : '/mo';
    }
  });
};
```

---

## Feature 2: Bento-to-Accordion Wrapper with Context Lock

- **Zero-Dependency Rule**: No pre-built component libraries (Radix, Shadcn, etc.) or JS animation runtimes (Framer Motion).
- **Desktop Layout**: Modern Bento Grid layout displaying core feature nodes.
- **Mobile Layout**: Responsive transition to an Accordion list when screen width is `< 768px`.
- **Context Lock Listener**:
  - We will listen to `resize` events (or use a media query listener via `window.matchMedia`).
  - The hovered/active item index in Bento Grid will be stored in a shared ref `activeIndexRef.current`.
  - When the layout flips to mobile, the Accordion state will read from `activeIndexRef.current` and smoothly expand the corresponding panel.
  - Height animation in the accordion will be achieved via pure CSS transition of `grid-template-rows` from `0fr` to `1fr` to prevent layout thrashing and preserve smooth motion (300ms - 400ms ease-in-out reflow).

---

## Proposed Changes

### Configuration & Base CSS
#### [MODIFY] [index.css](file:///C:/Users/Nitya/.gemini/antigravity/scratch/nextgen-ai-platform/src/index.css)
- Configure font imports (`JetBrains Mono` and `Inter`) and core color tokens.
- Set up core transitions and layouts.
- Standardize focus indicators (`:focus-visible`).

#### [MODIFY] [App.css](file:///C:/Users/Nitya/.gemini/antigravity/scratch/nextgen-ai-platform/src/App.css)
- Implement layout classes for bento grid, accordion transition constraints, and pricing elements.
- Implement CSS motion tokens:
  - `--transition-hover: 180ms cubic-bezier(0.16, 1, 0.3, 1);` (ease-out hover)
  - `--transition-reflow: 350ms cubic-bezier(0.4, 0, 0.2, 1);` (ease-in-out layout reflow)
- Establish CSS classes for fluid typography and mobile layout switches.

---

### Asset Integration
#### [MODIFY] [icons.svg](file:///C:/Users/Nitya/.gemini/antigravity/scratch/nextgen-ai-platform/public/icons.svg)
- Pack the 14 SVGs from `SVGs/SVGs/` into a single sprite sheet (`public/icons.svg`) using the `<symbol>` syntax. This permits lightweight and cached rendering:
  - `cog-8-tooth` -> `#icon-secure-guard`
  - `link` / `link-solid` -> `#icon-agent-build`
  - `cube-16-solid` -> `#icon-cloud-scale`
  - `chart-pie` -> `#icon-data-mining`
  - `search` -> `#icon-search`
  - `arrow-trending-up` -> `#icon-trending-up`
  - Navigation arrows (`chevron-down`, `chevron-up`, `chevron-left`, `chevron-right`)

---

### Component Architecture
#### [MODIFY] [App.jsx](file:///C:/Users/Nitya/.gemini/antigravity/scratch/nextgen-ai-platform/src/App.jsx)
Implement semantic HTML structure containing:

1. **Sticky Header**: Floating navigation bar using `<header>` and semantic elements, responsive mobile toggle.
2. **Hero Section**: High-converting display title, arrow hover CTA, client logo marquee.
3. **Feature Bento Grid (Feature 2)**: Core feature layout. Transfers active node state to Accordion on mobile reflow.
4. **Statistics**: Latency, speedup, uptime statistics, with looping particle fluid wave.
5. **Case Studies**: Hover selector that switches left side image preview using native CSS transition.
6. **Interactive Canvas**: Custom SVG wireframe sphere that deforms on hover.
7. **Telemetry Dashboard**: Dynamic chart widgets (SLA bar chart, Token usage, SVG path line chart).
8. **Our Approach**: Split layout with matrix eye effect and approach summary cards.
9. **Autonomy Tabs**: Discovery, Analysis, Training, Deploy scorecard triggers.
10. **Integrations Logo Grid**: Clean SVG logo container showing platform compatibility.
11. **Pricing Tier Matrix (Feature 1)**: Switcher toggle and currency dropdown connected to DOM refs for isolated direct mutation updates.
12. **Testimonials**: Clean user review cards.
13. **Insights Articles**: Large featured and small article layout.
14. **FAQ Accordion**: Navigation categories with expandable answer elements.
15. **Newsletter Subscription**: Semantic form with `type="email"`, correct autocomplete name.
16. **Footer**: Nav links, copyright notices, and large "armory" display text.

---

## Verification Plan

### Automated Tests
- `npm run build`: Confirm Vite bundle compiles successfully without errors.
- `npm run lint`: Confirm Oxlint code quality validation passes.

### Manual Verification
- **State Isolation Check**: Open Chrome DevTools Paint Flashing, toggle currency and billing, verify that only the targeted price text nodes flash (indicating zero parent component re-renders).
- **Context Lock Test**: Interact with a bento node on desktop to set active state, resize window to mobile width, verify corresponding accordion panel opens smoothly.
- **Performance Thresholds**: Validate that the initial loader runs and completes under 500ms, and animation transitions fit the micro-interaction and structural layout reflow thresholds.
- **Lighthouse Scan**: Verify performance, accessibility, best practices, and SEO scores are > 95%.
