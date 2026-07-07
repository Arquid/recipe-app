// src/hooks/useRecipeSearch.js
import { useState, useRef } from "react";
import { searchRecipes, PAGE_SIZE } from "../api/spoonacular";

export function useRecipeSearch(apiKey) {
  const [recipes, setRecipes] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const lastParamsRef = useRef(null);
  const offsetRef = useRef(0);

  async function search({ dishQuery, ingredientsQuery, cuisine, diet, sort }) {
    if (!apiKey.trim()) {
      setError("Add your Spoonacular API key above before searching.");
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);
    setRecipes([]);
    offsetRef.current = 0;
    lastParamsRef.current = { dishQuery, ingredientsQuery, cuisine, diet, sort };

    try {
      const { results, totalResults } = await searchRecipes({
        apiKey, dishQuery, ingredientsQuery, cuisine, diet, sort, offset: 0,
      });
      setRecipes(results);
      setTotalResults(totalResults);
    } catch (err) {
      setError(err.message || "Something went wrong while searching.");
    } finally {
      setLoading(false);
    }
  }

  async function loadMore() {
    if (!lastParamsRef.current || loadingMore) return;

    setLoadingMore(true);
    setError(null);
    const nextOffset = offsetRef.current + PAGE_SIZE;

    try {
      const { results, totalResults } = await searchRecipes({
        apiKey,
        ...lastParamsRef.current,
        offset: nextOffset,
      });
      setRecipes((prev) => [...prev, ...results]);
      setTotalResults(totalResults);
      offsetRef.current = nextOffset;
    } catch (err) {
      setError(err.message || "Could not load more recipes.");
    } finally {
      setLoadingMore(false);
    }
  }

  const canLoadMore = recipes.length > 0 && recipes.length < totalResults;

  return {
    recipes, loading, loadingMore, error, hasSearched,
    totalResults, canLoadMore, search, loadMore,
  };
}