// src/App.jsx
import { useState } from "react";
import "./App.css";
import { Soup, Heart } from "lucide-react";

import ApiKeyInput from "./components/ApiKeyInput";
import SearchForm from "./components/SearchForm";
import { LoadingIndicator, ErrorMessage, EmptyState } from "./components/StatusMessage";
import RecipeGrid from "./components/RecipeGrid";
import RecipeModal from "./components/RecipeModal";
import LoadMoreButton from "./components/LoadMoreButton";
import BackToTopButton from "./components/BackToTopButton";

import { useRecipeSearch } from "./hooks/useRecipeSearch";
import { useRecipeDetails } from "./hooks/useRecipeDetails";
import { useFavorites } from "./hooks/useFavorites";
import { useApiKey } from "./hooks/useApiKey";

export default function App() {
  const { apiKey, setApiKey, remember, setRemember } = useApiKey();
  const [dishQuery, setDishQuery] = useState("");
  const [ingredientsQuery, setIngredientsQuery] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [sort, setSort] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [diet, setDiet] = useState("");

  const {
    recipes, loading, loadingMore, error, hasSearched,
    canLoadMore, search, loadMore,
  } = useRecipeSearch(apiKey);
  const details = useRecipeDetails(apiKey);
  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  function handleSubmit(e) {
    e.preventDefault();
    setShowFavorites(false);
    search({ dishQuery, ingredientsQuery, cuisine, sort, diet });
  }

  return (
    <div className="rs-app">
      <header className="rs-hero">
        <div className="rs-eyebrow"><Soup size={14} /> Recipe finder</div>
        <h1 className="rs-title">What's in your kitchen?</h1>
        <p className="rs-subtitle">
          Search by dish name, ingredients you already have, or a cuisine you're craving.
        </p>
        <button
          type="button"
          className={`rs-favorites-toggle${showFavorites ? " rs-favorites-toggle-active" : ""}`}
          onClick={() => setShowFavorites((v) => !v)}
        >
          <Heart size={14} fill={showFavorites ? "currentColor" : "none"} />
          {showFavorites ? "Back to search" : `My favorites (${favorites.length})`}
        </button>
      </header>

      {!showFavorites && (
        <section className="rs-panel">
          <ApiKeyInput
            value={apiKey}
            onChange={setApiKey}
            remember={remember}
            onRememberChange={setRemember}
          />
          <SearchForm
            dishQuery={dishQuery}
            onDishQueryChange={setDishQuery}
            ingredientsQuery={ingredientsQuery}
            onIngredientsQueryChange={setIngredientsQuery}
            cuisine={cuisine}
            onCuisineChange={setCuisine}
            diet={diet}
            onDietChange={setDiet}
            sort={sort}
            onSortChange={setSort}
            onSubmit={handleSubmit}
          />
        </section>
      )}

      {!showFavorites && (
        <>
          <ErrorMessage message={error} />
          {loading && <LoadingIndicator label="Searching for recipes…" />}
          {!loading && hasSearched && !error && recipes.length === 0 && <EmptyState />}
          {!loading && recipes.length > 0 && (
            <>
              <RecipeGrid
                recipes={recipes}
                onSelectRecipe={details.open}
                isFavorite={isFavorite}
                onToggleFavorite={toggleFavorite}
              />
              {canLoadMore && (
                <LoadMoreButton onClick={loadMore} loading={loadingMore} />
              )}
            </>
          )}
        </>
      )}

      {showFavorites && (
        favorites.length === 0 ? (
          <EmptyState message="You haven't saved any favorites yet. Tap the heart on a recipe card to save it here." />
        ) : (
          <RecipeGrid
            recipes={favorites}
            onSelectRecipe={details.open}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
          />
        )
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
