// src/api/spoonacular.js
const BASE_URL = "https://api.spoonacular.com";
export const PAGE_SIZE = 12;

export async function searchRecipes({ apiKey, dishQuery, ingredientsQuery, cuisine, diet, sort, offset = 0, signal }) {
  const params = new URLSearchParams({
    apiKey: apiKey.trim(),
    number: String(PAGE_SIZE),
    offset: String(offset),
    addRecipeInformation: "true",
  });

  if (dishQuery.trim()) params.set("query", dishQuery.trim());
  if (ingredientsQuery.trim()) params.set("includeIngredients", ingredientsQuery.trim());
  if (cuisine) params.set("cuisine", cuisine);
  if (diet) params.set("diet", diet);
  if (sort) {
    params.set("sort", sort);
  } else if (!dishQuery.trim() && !ingredientsQuery.trim() && !cuisine) {
    params.set("sort", "popularity");
  }

  const res = await fetch(`${BASE_URL}/recipes/complexSearch?${params}`, { signal });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message || `Search failed (status ${res.status}).`);
  }
  const data = await res.json();

  return {
    results: data.results || [],
    totalResults: data.totalResults || 0,
  };
}

export async function fetchRecipeDetails({ apiKey, id }) {
  const params = new URLSearchParams({
    apiKey: apiKey.trim(),
    includeNutrition: "false",
  });
  const res = await fetch(`${BASE_URL}/recipes/${id}/information?${params}`);
  if (!res.ok) {
    throw new Error(`Could not load this recipe (status ${res.status}).`);
  }

  return res.json();
}