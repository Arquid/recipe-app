import { useRef, useState } from "react";
import { fetchRecipeDetails } from "../api/spoonacular";
import { getCachedDetail, setCachedDetail } from "../utils/detailCache";

export function useRecipeDetails(apiKey) {
  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  async function open(id) {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setSelectedId(id);
    setError(null);

    const cached = getCachedDetail(id);
    if (cached) {
      setDetail(cached);
      setLoading(false);
      return;
    }

    setDetail(null);

    if (!apiKey.trim()) {
      setLoading(false);
      setError("Add your Spoonacular API key to open this recipe.");
      return;
    }

    setLoading(true);
    try {
      const data = await fetchRecipeDetails({ apiKey, id, signal: controller.signal });
      setCachedDetail(id, data);
      setDetail(data);
    } catch (err) {
      if (err.name === "AbortError") return;
      setError(err.message || "Could not load this recipe.");
    } finally {
      if (abortRef.current === controller) setLoading(false);
    }
  }

  function close() {
    abortRef.current?.abort();
    setSelectedId(null);
    setDetail(null);
    setError(null);
  }

  return { selectedId, detail, loading, error, open, close };
}