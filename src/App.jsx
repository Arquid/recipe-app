// src/App.jsx
import { useState } from "react";
import "./App.css";
import { Soup } from "lucide-react";

import ApiKeyInput from "./components/ApiKeyInput";
import SearchForm from "./components/SearchForm";
import { LoadingIndicator, ErrorMessage, EmptyState } from "./components/StatusMessage";
import RecipeGrid from "./components/RecipeGrid";
import RecipeModal from "./components/RecipeModal";
import LoadMoreButton from "./components/LoadMoreButton";
import BackToTopButton from "./components/BackToTopButton";

import { useRecipeSearch } from "./hooks/useRecipeSearch";
import { useRecipeDetails } from "./hooks/useRecipeDetails";

export default function App() {
  const [apiKey, setApiKey] = useState("");
  const [dishQuery, setDishQuery] = useState("");
  const [ingredientsQuery, setIngredientsQuery] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [sort, setSort] = useState("");

  const {
    recipes, loading, loadingMore, error, hasSearched,
    canLoadMore, search, loadMore,
  } = useRecipeSearch(apiKey);
  const details = useRecipeDetails(apiKey);

  function handleSubmit(e) {
    e.preventDefault();
    search({ dishQuery, ingredientsQuery, cuisine, sort });
  }

  return (
    <div className="rs-app">
      <header className="rs-hero">
        <div className="rs-eyebrow"><Soup size={14} /> Recipe finder</div>
        <h1 className="rs-title">What's in your kitchen?</h1>
        <p className="rs-subtitle">
          Search by dish name, ingredients you already have, or a cuisine you're craving.
        </p>
      </header>

      <section className="rs-panel">
        <ApiKeyInput value={apiKey} onChange={setApiKey} />
        <SearchForm
          dishQuery={dishQuery}
          onDishQueryChange={setDishQuery}
          ingredientsQuery={ingredientsQuery}
          onIngredientsQueryChange={setIngredientsQuery}
          cuisine={cuisine}
          onCuisineChange={setCuisine}
          sort={sort}
          onSortChange={setSort}
          onSubmit={handleSubmit}
        />
      </section>

      <ErrorMessage message={error} />
      {loading && <LoadingIndicator label="Searching for recipes…" />}
      {!loading && hasSearched && !error && recipes.length === 0 && <EmptyState />}
      {!loading && recipes.length > 0 && (
        <>
          <RecipeGrid recipes={recipes} onSelectRecipe={details.open} />
          {canLoadMore && (
            <LoadMoreButton onClick={loadMore} loading={loadingMore} />
          )}
        </>
      )}

      {details.selectedId && (
        <RecipeModal
          detail={details.detail}
          loading={details.loading}
          error={details.error}
          onClose={details.close}
        />
      )}

      <BackToTopButton />
    </div>
  );
}