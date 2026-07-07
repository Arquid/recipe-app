# Recipe Finder

A small React + Vite app for searching recipes with the [Spoonacular](https://spoonacular.com/food-api) API. Search by dish name, ingredients you already have, a cuisine, or a diet — then browse results, load more, and open any recipe for full ingredients and step-by-step instructions.

## Features

- Search recipes by dish name, ingredients, cuisine, and/or diet (vegetarian, vegan, gluten free, ketogenic, paleo)
- Sort results by popularity, healthiness, or cooking time
- Infinite "load more" pagination
- Save recipes as favorites (persisted in the browser via `localStorage`) and browse them in a dedicated favorites view
- Recipe detail modal with ingredients and instructions
- Back-to-top button for long result lists
- No backend required — bring your own free Spoonacular API key

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- A free API key from [spoonacular.com/food-api](https://spoonacular.com/food-api)

### Installation

```bash
npm install
npm run dev
```

Open the printed local URL, paste your Spoonacular API key into the field at the top of the page, and start searching. The key is only kept in memory for the current session — nothing is stored or sent anywhere except directly to Spoonacular's API.

## Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with hot reload |
| `npm run build` | Build a production bundle into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint over the project |

## Project structure

```
src/
├── api/spoonacular.js        # Spoonacular API calls
├── components/                # UI components
├── hooks/                     # useRecipeSearch, useRecipeDetails, useFavorites
├── utils/text.js              # HTML stripping / truncation helpers
├── constants.js                # Cuisine, diet, and sort option lists
└── App.jsx                    # App shell / state wiring
```

## Tech stack

- [React 19](https://react.dev/)
- [Vite](https://vite.dev/)
- [lucide-react](https://lucide.dev/) for icons

## License

[MIT](LICENSE)
