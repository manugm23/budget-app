# Budget Calculator SPA

A single-page application built with **React + TypeScript** that allows users to create, manage, and share digital service budgets dynamically. Prices update in real time, budgets are saved with a unique ID, and each one can be shared via a permanent URL — no backend required.

🔗 **Live demo:** [manugm23.github.io/budget-app](https://manugm23.github.io/budget-app/)

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Configuration](#configuration)
- [How it works](#how-it-works)
- [Pricing formula](#pricing-formula)
- [Routing](#routing)
- [Accessibility](#accessibility)
- [Testing](#testing)
- [Git Flow](#git-flow)
- [Deployment](#deployment)

---

## Features

### Epic 1 — Service selection and price calculator
- Select one or more services (SEO, Ads, Web) via checkboxes
- Price updates instantly with every change
- Web service includes an extras configurator: number of pages and languages
- Formula: `base price + (pages + languages) × 30€`

### Epic 2 — Budget generation
- Client form: full name, email, phone
- Real-time field validation with accessible error messages
- On submit: generates a UUID, saves to localStorage, shows a success toast
- Button disabled until at least one service is selected

### Epic 3 — Budget history
- Searchable list of all saved budgets (by name, email, or phone)
- Sortable by date, amount, and name
- Each budget shows contracted services, web configuration, and total
- Custom confirmation modal for deletions
- Copy link button that copies the shareable URL to clipboard

### Epic 4 — Shareable URL
- Each budget has a unique URL: `/#/budget/:uuid`
- Full detail view: client info, service breakdown, total
- Works without any backend — routing is hash-based

---

## Tech stack

| Category | Technology |
|---|---|
| Framework | React 18 |
| Language | TypeScript |
| Build tool | Vite |
| Testing | Vitest + React Testing Library |
| Deployment | GitHub Pages |
| Persistence | localStorage |
| Routing | Custom hash-based router |
| Styling | Inline styles (no external CSS library) |

---

## Project structure

```
budget-app/
├── public/
├── src/
│   ├── components/
│   │   ├── Header.tsx          # Top navigation bar
│   │   ├── Hero.tsx            # Decorative hero section
│   │   ├── ServiceCard.tsx     # Service checkbox card
│   │   ├── WebConfigurator.tsx # Pages and languages spinners
│   │   ├── PriceFooter.tsx     # Live price display
│   │   ├── ClientForm.tsx      # Client data form with validation
│   │   ├── BudgetList.tsx      # History with search and sort
│   │   ├── BudgetDetail.tsx    # Shareable budget detail view
│   │   ├── ConfirmModal.tsx    # Delete confirmation modal
│   │   └── SuccessToast.tsx    # Success notification
│   ├── config/
│   │   └── services.json       # Prices and texts — edit here, no code changes needed
│   ├── hooks/
│   │   ├── useLocalStorage.ts  # Generic localStorage sync hook
│   │   └── useHash.ts          # Hash-based routing hook
│   ├── utils/
│   │   ├── pricing.ts          # calculateTotal pure function
│   │   ├── generateId.ts       # UUID generation and short ID
│   │   └── shareUrl.ts         # Shareable URL builder
│   ├── types/
│   │   └── index.ts            # All TypeScript interfaces and types
│   ├── styles/
│   │   └── global.css          # Global reset and base styles
│   ├── tests/
│   │   ├── setup.ts
│   │   ├── pricing.test.ts
│   │   ├── generateId.test.ts
│   │   ├── ServiceCard.test.tsx
│   │   ├── ClientForm.test.tsx
│   │   └── BudgetList.test.tsx
│   ├── App.tsx                 # Root component — manages all state
│   └── main.tsx                # Entry point
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
└── package.json
```

---

## Getting started

### Prerequisites

- Node.js v18 or higher
- npm v9 or higher
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/manugm23/budget-app.git
cd budget-app

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Available scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview the production build locally
npm run test       # Run tests in watch mode
npm run test:run   # Run tests once and exit
npm run deploy     # Build and deploy to GitHub Pages
```

---

## Configuration

All prices and service texts live in `src/config/services.json`. To change a price or add a service, edit only this file — no component changes needed.

```json
{
  "pageLanguageRate": 30,
  "services": [
    {
      "id": "seo",
      "name": "SEO",
      "description": "Full responsive web programming",
      "price": 300,
      "hasExtras": false
    },
    {
      "id": "ads",
      "name": "Ads",
      "description": "Full responsive web programming",
      "price": 400,
      "hasExtras": false
    },
    {
      "id": "web",
      "name": "Web",
      "description": "Full responsive web programming",
      "price": 500,
      "hasExtras": true
    }
  ]
}
```

**`pageLanguageRate`** — price in euros added per extra page or language in the Web service.

**`hasExtras: true`** — marks a service as having the pages/languages configurator.

---

## How it works

### State management

All state lives in `App.tsx` and flows down to child components as props. No external state library is used.

```
App
├── selectedServices: string[]    — which service IDs are checked
├── webConfig: WebConfig          — pages and languages for Web service
├── budgets: Budget[]             — all saved budgets (synced to localStorage)
└── toast: Budget | null          — the last created budget, shown in the toast
```

### Data persistence

Budgets are saved in `localStorage` under the key `budgets_v1` using the custom `useLocalStorage` hook. The hook reads once on mount and writes on every change, keeping React state and localStorage in sync automatically.

```typescript
// Usage in App.tsx
const [budgets, setBudgets] = useLocalStorage<Budget[]>('budgets_v1', [])
```

### Unique IDs

Each budget receives a UUID v4 generated by `crypto.randomUUID()`, a built-in browser API that requires no external dependency.

```typescript
export function generateId(): string {
  return crypto.randomUUID()
}
```

---

## Pricing formula

```
total = Σ service.price + (pages + languages) × pageLanguageRate
```

**Example:** SEO + Web with 2 pages and 3 languages

```
SEO  →  300€
Web  →  500€ base + (2 + 3) × 30€ = 650€
─────────────────────────────────────────
Total →  950€
```

The calculation happens in `src/utils/pricing.ts` as a pure function with no side effects, making it easy to unit test independently from any component.

---

## Routing

The app uses a custom hash-based router with no external routing library. The `useHash` hook reads `window.location.hash` and listens for `hashchange` events.

| URL hash | View rendered |
|---|---|
| `""` (empty) | Home — calculator and budget history |
| `#/budget/:id` | Budget detail — shareable view |

```typescript
// In App.tsx
const hash = useHash()
const budgetMatch = hash.match(/^#\/budget\/(.+)$/)

if (budgetMatch) {
  return <BudgetDetail budgetId={budgetMatch[1]} budgets={budgets} />
}
```

Each budget's shareable URL is built by `src/utils/shareUrl.ts`:

```typescript
export function getBudgetUrl(budgetId: string): string {
  const base = window.location.href.split('#')[0]
  return `${base}#/budget/${budgetId}`
}
```

---

## Accessibility

The app follows WCAG guidelines throughout:

- All form fields have associated `<label>` elements
- Error messages use `role="alert"` and `aria-describedby` to be announced by screen readers
- The live price uses `aria-live="polite"` so updates are announced without interrupting the user
- All icon-only buttons have `aria-label`
- Keyboard navigation is fully supported with visible focus rings
- The delete confirmation uses `role="dialog"` and `aria-modal="true"`
- Decorative SVG shapes are hidden with `aria-hidden="true"`
- A `.sr-only` utility class is available for screen-reader-only content

---

## Testing

30 unit tests written with **Vitest** and **React Testing Library**. Tests verify behavior from the user's perspective, not implementation details.

```bash
npm run test:run
```

### Test coverage

| File | Tests | What is tested |
|---|---|---|
| `pricing.test.ts` | 8 | Price formula for all service combinations |
| `generateId.test.ts` | 4 | UUID format, uniqueness, short ID |
| `ServiceCard.test.tsx` | 5 | Toggle behavior, web configurator visibility |
| `ClientForm.test.tsx` | 6 | Validation, error messages, form reset |
| `BudgetList.test.tsx` | 7 | Search filtering, delete modal, sort |

### Gherkin scenarios (key examples)

```gherkin
Feature: Pricing formula
  Scenario: Web service with 2 pages and 3 languages
    When I check the Web checkbox
    And I set pages to 2
    And I set languages to 3
    Then the total shows 650€

Feature: Form validation
  Scenario: Submit with empty fields
    Given at least one service is selected
    When I click "Request budget" without filling the form
    Then I see "Name is required"
    And I see "Email is required"
    And I see "Phone is required"

Feature: Budget history
  Scenario: Delete confirmation modal
    When I click the Delete button on a budget
    Then a confirmation modal appears
    And onDelete is called only after clicking the confirm button
    And the modal closes when I click Cancel
```

---

## Git Flow

The project followed the Git Flow branching model throughout development.

```
main          ← production releases only
develop       ← integration branch
  ├── feature/types-and-config   TypeScript types + services.json
  ├── feature/utils              pricing, generateId, shareUrl
  ├── feature/hooks              useLocalStorage, useHash
  ├── feature/components         all React components
  ├── feature/app                App.tsx — connects everything
  └── feature/tests              30 unit tests + Vitest config
```

### Workflow

```bash
# Start a new feature
git checkout develop
git checkout -b feature/feature-name

# Work and commit in small steps
git add .
git commit -m "feat: description of the change"

# When the feature is complete
git push -u origin feature/feature-name
git checkout develop
git merge --no-ff feature/feature-name -m "feat: merge feature-name"
git push origin develop

# Release to production
git checkout main
git merge --no-ff develop -m "release: v1.0.0"
git push origin main
```

### Commit message convention

```
feat:     new feature
fix:      bug fix
chore:    tooling or configuration changes
refactor: code change with no functional impact
test:     adding or updating tests
```

---

## Deployment

The app is deployed to **GitHub Pages** using the `gh-pages` package.

### Configuration

The `base` option in `vite.config.ts` is required for GitHub Pages because the app lives under a sub-path:

```typescript
export default defineConfig({
  plugins: [react()],
  base: '/budget-app/',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
  },
})
```

### Deploy

```bash
npm run deploy
```

This runs `npm run build` first (via the `predeploy` script) and then pushes the `dist/` folder to the `gh-pages` branch. GitHub Pages serves from that branch automatically.

### Why no backend is needed

| Need | Solution |
|---|---|
| Persist budgets | `localStorage` |
| Unique identifiers | `crypto.randomUUID()` |
| Client-side routing | Hash-based URL (`#/budget/:id`) |
| Share budgets | Hash URL copied to clipboard |
