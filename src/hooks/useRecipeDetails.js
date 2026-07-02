import { useState } from "react";
import { fetchRecipeDetails } from "../api/spoonacular";

export function useRecipeDetails(apiKey) {
  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function open(id) {
    setSelectedId(id);
    setDetail(null);
    setError(null);
    setLoading(true);
    try {
      const data = await fetchRecipeDetails({ apiKey, id });
      setDetail(data);
    } catch (err) {
      setError(err.message || "Could not load this recipe.");
    } finally {
      setLoading(false);
    }
  }

  function close() {
    setSelectedId(null);
    setDetail(null);
    setError(null);
  }

  return { selectedId, detail, loading, error, open, close };
}