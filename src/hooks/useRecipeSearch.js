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
  const abortRef = useRef(null);

  async function search({ dishQuery, ingredientsQuery, cuisine, diet, sort }) {
    if (!apiKey.trim()) {
      setError("Add your Spoonacular API key above before searching.");
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    setHasSearched(true);
    setRecipes([]);
    offsetRef.current = 0;
    lastParamsRef.current = { dishQuery, ingredientsQuery, cuisine, diet, sort };

    try {
      const { results, totalResults } = await searchRecipes({
        apiKey, dishQuery, ingredientsQuery, cuisine, diet, sort, offset: 0,
        signal: controller.signal,
      });
      setRecipes(results);
      setTotalResults(totalResults);
    } catch (err) {
      if (err.name === "AbortError") return;
      setError(err.message || "Something went wrong while searching.");
    } finally {
      if (abortRef.current === controller) setLoading(false);
    }
  }

  async function loadMore() {
    if (!lastParamsRef.current || loadingMore) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoadingMore(true);
    setError(null);
    const nextOffset = offsetRef.current + PAGE_SIZE;

    try {
      const { results, totalResults } = await searchRecipes({
        apiKey,
        ...lastParamsRef.current,
        offset: nextOffset,
        signal: controller.signal,
      });
      setRecipes((prev) => [...prev, ...results]);
      setTotalResults(totalResults);
      offsetRef.current = nextOffset;
    } catch (err) {
      if (err.name === "AbortError") return;
      setError(err.message || "Could not load more recipes.");
    } finally {
      if (abortRef.current === controller) setLoadingMore(false);
    }
  }

  const canLoadMore = recipes.length > 0 && recipes.length < totalResults;

  return {
    recipes, loading, loadingMore, error, hasSearched,
    totalResults, canLoadMore, search, loadMore,
  };
}