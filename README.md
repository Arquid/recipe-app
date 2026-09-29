# Recipe Finder

[![CI](https://github.com/Arquid/recipe-app/actions/workflows/ci.yml/badge.svg)](https://github.com/Arquid/recipe-app/actions/workflows/ci.yml)

A small React + Vite app for searching recipes with the [Spoonacular](https://spoonacular.com/food-api) API. Search by dish name, ingredients you already have, a cuisine, or a diet — then browse results, load more, and open any recipe for full ingredients and step-by-step instructions.

## Features

- Search recipes by dish name, ingredients, cuisine, and/or diet (vegetarian, vegan, gluten free, ketogenic, paleo)
- Sort results by popularity, healthiness, or cooking time
- Infinite "load more" pagination
- Save recipes as favorites (persisted in the browser via `localStorage`) and browse them in a dedicated favorites view
- Recipe detail modal with ingredients and instructions
- Print a recipe or share/copy its link straight from the modal
- Keyboard-friendly recipe modal: close with Esc, focus stays trapped inside while it's open, and focus returns to where you were once it closes
- Recipe modal is code-split (`React.lazy`) so it's only downloaded when a recipe is opened
- Wrapped in error boundaries so an unexpected crash (e.g. a failed chunk download) shows a recoverable message instead of a blank page
- Back-to-top button for long result lists
- No backend required — bring your own free Spoonacular API key

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 20 or newer (see [`.nvmrc`](.nvmrc))
- A free API key from [spoonacular.com/food-api](https://spoonacular.com/food-api)

### Installation

```bash
npm install
npm run dev
```

Open the printed local URL, paste your Spoonacular API key into the field at the top of the page, and start searching. By default the key is only kept in memory for the current session; check "Remember on this device" to persist it in the browser's `localStorage` so you don't have to paste it again next time. Either way, the key is never sent anywhere except directly to Spoonacular's API.

## Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with hot reload |
| `npm run build` | Build a production bundle into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint over the project |
| `npm run test` | Run the Vitest test suite |
| `npm run coverage` | Run the test suite with a code coverage report |
| `npm run e2e` | Run the Playwright end-to-end smoke tests against a production build |

## Project structure

```
src/
├── api/spoonacular.js        # Spoonacular API calls
├── components/                # UI components (incl. ErrorBoundary)
├── hooks/                     # useRecipeSearch, useRecipeDetails, useFavorites, useApiKey
├── utils/text.js              # HTML stripping / truncation helpers
├── test/setup.js               # Vitest setup (accessibility matcher)
├── constants.js                # Cuisine, diet, and sort option lists
└── App.jsx                    # App shell / state wiring
```

Every component and hook has a co-located `*.test.jsx`/`*.test.js` file.

## CI

Every push and pull request to `main` runs lint, tests with coverage (enforced by minimum thresholds, see `vite.config.js`), a production build, Playwright end-to-end smoke tests against that build, and a dependency audit (`npm audit --audit-level=high`) via [GitHub Actions](.github/workflows/ci.yml). [Dependabot](.github/dependabot.yml) opens weekly PRs for outdated npm and GitHub Actions dependencies.

**After merging a Dependabot PR that needed conflict resolution** (e.g. two version bumps landing close together), diff the merged file against what the PR claimed to change before trusting it — a conflict can be resolved in the wrong direction and silently keep the old version even though GitHub shows the PR as merged. This happened once with an `actions/checkout` bump; see the commit history around September 2026 for the fix.

## Testing

- Unit tests for every hook and API call, including the search/detail request-cancellation logic
- Component tests for all UI components (rendering, interaction, keyboard behavior)
- An integration test (Vitest + Testing Library) that exercises the full app with mocked API calls: search → open a recipe → save a favorite → close
- End-to-end smoke tests (Playwright, `e2e/`) that run against a real production build and preview server, catching issues the mocked tests structurally can't (routing, asset paths, the code-split chunk actually loading)
- Accessibility checks (via [vitest-axe](https://github.com/chance/vitest-axe), with the `color-contrast` rule disabled since jsdom can't render real styles) on the key interactive components
- A React error boundary is tested directly, and one wraps the app so a rendering crash degrades gracefully instead of a blank page

## Tech stack

- [React 19](https://react.dev/)
- [Vite](https://vite.dev/)
- [lucide-react](https://lucide.dev/) for icons
- [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) for unit/component/integration tests
- [vitest-axe](https://github.com/chance/vitest-axe) for automated accessibility checks
- [Playwright](https://playwright.dev/) for end-to-end smoke tests

## License

[MIT](LICENSE)
