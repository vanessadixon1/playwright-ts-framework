# Playwright TypeScript Automation Framework

Enterprise-grade test automation framework built with Playwright and TypeScript. Covers UI end-to-end testing, REST API testing, Page Object Model, custom fixtures, structured reporting, and a full GitHub Actions CI pipeline.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| [Playwright](https://playwright.dev) | Browser automation + API testing engine |
| [TypeScript](https://www.typescriptlang.org) | Type-safe test authoring |
| [Winston](https://github.com/winstonjs/winston) | Structured request/response logging |
| [Faker.js](https://fakerjs.dev) | Dynamic test data generation |
| [Allure](https://docs.qameta.io/allure/) | Rich HTML test reporting |
| [ESLint](https://eslint.org) | Code quality enforcement |
| [GitHub Actions](https://docs.github.com/en/actions) | CI/CD pipeline |

---

## Project Structure

```
playwright-ts-framework/
│
├── .github/
│   └── workflows/
│       └── playwright.yml          # CI pipeline (lint → API tests → browser matrix → Allure report)
│
├── src/
│   ├── api/
│   │   ├── ApiClient.ts            # Base HTTP client (GET / POST / PUT / PATCH / DELETE)
│   │   ├── index.ts
│   │   └── endpoints/
│   │       ├── AuthApi.ts          # /auth/login, refresh, getCurrentUser
│   │       └── UsersApi.ts         # /users CRUD + search + pagination
│   │
│   ├── data/
│   │   └── users.ts                # Typed credential sets for UI and API tests
│   │
│   ├── fixtures/
│   │   └── index.ts                # Extended test object — page objects + API clients + auth session
│   │
│   ├── pages/
│   │   ├── BasePage.ts             # Abstract base — navigate, wait, fill, click, screenshot helpers
│   │   ├── LoginPage.ts
│   │   ├── InventoryPage.ts
│   │   └── CartPage.ts
│   │
│   ├── types/
│   │   └── index.ts                # All TypeScript interfaces (User, LoginResponse, etc.)
│   │
│   └── utils/
│       ├── env.ts                  # Typed environment variable loader
│       ├── helpers.ts              # Retry logic, faker wrappers, screenshot util
│       └── logger.ts               # Winston logger — console + rotating file output
│
├── tests/
│   ├── api/
│   │   ├── auth.spec.ts            # 7 authentication tests
│   │   └── users.spec.ts           # 11 users CRUD / schema / pagination tests
│   │
│   └── ui/
│       ├── login.spec.ts           # 6 login tests (happy path + error states)
│       ├── inventory.spec.ts       # 9 inventory tests (sort, cart, logout)
│       └── cart.spec.ts            # 4 cart tests (items, checkout flow)
│
├── playwright.config.ts            # 5 test projects, reporters, retries, timeouts
├── tsconfig.json
├── .eslintrc.json
└── .env.example
```

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher

### Installation

```bash
# Clone the repo
git clone https://github.com/vanessadixon1/playwright-ts-framework.git
cd playwright-ts-framework

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Environment Setup

```bash
cp .env.example .env
```

The defaults in `.env.example` work out of the box against the public test sites. Edit `.env` only if you are pointing the framework at a different environment.

```env
BASE_URL=https://www.saucedemo.com     # UI test target
API_BASE_URL=https://dummyjson.com     # API test target
STANDARD_USER=standard_user
TEST_PASSWORD=secret_sauce
```

---

## Running Tests

### All tests
```bash
npm test
```

### By suite
```bash
npm run test:ui          # UI tests (Chromium only)
npm run test:api         # API tests
npm run test:smoke       # Everything tagged @smoke across all suites
npm run test:regression  # Everything tagged @regression across all suites
```

### By browser
```bash
npx playwright test tests/ui/ --project=chromium
npx playwright test tests/ui/ --project=firefox
npx playwright test tests/ui/ --project=webkit
npx playwright test tests/ui/ --project=mobile-chrome
```

### Debug & development
```bash
npm run test:headed      # Run with a visible browser
npm run test:debug       # Pause at each step with Playwright Inspector
```

---

## Reporting

### HTML Report (built-in)
```bash
npm test
npm run test:report      # Opens the Playwright HTML report
```

### Allure Report
```bash
ALLURE_RESULTS=true npm test           # Run tests and emit Allure data
npm run allure:generate                # Build the report
npm run allure:open                    # Open it in a browser
# or
npm run allure:serve                   # Serve and open in one step
```

Reports are written to the `reports/` directory:

| Path | Contents |
|---|---|
| `reports/playwright-report/` | Playwright HTML report |
| `reports/allure-results/` | Raw Allure data |
| `reports/allure-report/` | Generated Allure HTML report |
| `reports/junit-results.xml` | JUnit XML (for CI integrations) |
| `reports/test-results.json` | Full JSON results |
| `reports/logs/` | Winston log files |

---

## Architecture

### Page Object Model

Every page extends `BasePage`, which provides shared helpers (`navigate`, `fillField`, `clickAndWait`, `takeScreenshot`, etc.). Page classes own their locators as private getters and expose only high-level action and assertion methods to tests.

```
BasePage (abstract)
  └── LoginPage
  └── InventoryPage
  └── CartPage
```

### API Client Hierarchy

`ApiClient` is the base class holding Playwright's `request` context and `baseUrl`. It exposes `protected` HTTP methods (`get`, `post`, `put`, `patch`, `delete`) with built-in logging. Endpoint classes extend it and add typed, named methods.

```
ApiClient (base)
  └── UsersApi     → getUsers, getUserById, createUser, updateUser, deleteUser ...
  └── AuthApi      → login, refreshToken, getCurrentUser ...
```

### Custom Fixtures

The `src/fixtures/index.ts` file extends Playwright's `test` object to auto-inject fully constructed page objects and API clients into every test. The `authenticatedPage` fixture handles the full login flow before the test body runs — no boilerplate login code in specs.

```ts
// Any test that needs an authenticated session gets it automatically
test('add item to cart', async ({ authenticatedPage }) => {
  await authenticatedPage.addItemToCart('Sauce Labs Backpack');
  await authenticatedPage.assertCartCount(1);
});
```

### Test Tags

Every test is tagged for targeted execution:

| Tag | When to run |
|---|---|
| `@smoke` | After every deployment — fast, critical-path only |
| `@regression` | Full suite — nightly or pre-release |

```bash
npx playwright test --grep "@smoke"
npx playwright test --grep "@regression"
```

---

## CI / GitHub Actions

The pipeline in `.github/workflows/playwright.yml` runs on every push and pull request to `main` or `develop`, on a nightly schedule, and on manual trigger.

```
push / PR / schedule / manual
        │
        ▼
┌─────────────────┐
│  quality-gate   │  ESLint + TypeScript type check
└────────┬────────┘
         │ (on pass)
         ▼
┌──────────────────────────────────┐
│  api-tests   │  ui-tests matrix  │  Run in parallel
│              │  chromium         │
│              │  firefox          │
│              │  webkit           │
└──────┬───────┴─────────┬─────────┘
       │                 │
       └────────┬────────┘
                ▼
       ┌─────────────────┐
       │  publish-report │  Merge Allure results → GitHub Pages
       └─────────────────┘
```

Artifacts retained for 30 days. Allure report published to GitHub Pages on merges to `main`.

---

## Code Quality

```bash
npm run lint          # Run ESLint
npm run lint:fix      # Auto-fix ESLint issues
npm run type-check    # TypeScript strict mode check
```

---

## Test Counts

| Suite | Smoke | Regression | Total |
|---|---|---|---|
| UI — Login | 2 | 4 | 6 |
| UI — Inventory | 3 | 6 | 9 |
| UI — Cart | 1 | 3 | 4 |
| API — Auth | 2 | 5 | 7 |
| API — Users | 3 | 8 | 11 |
| **Total** | **11** | **26** | **37** |
