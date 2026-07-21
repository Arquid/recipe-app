import { describe, it, expect, beforeEach, vi } from "vitest";
import { searchRecipes, fetchRecipeDetails, PAGE_SIZE } from "./spoonacular";

describe("searchRecipes", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it("builds the correct query params for a basic search", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ results: [{ id: 1 }], totalResults: 1 }),
    });

    await searchRecipes({
      apiKey: " abc123 ", dishQuery: "pasta", ingredientsQuery: "", cuisine: "", diet: "", sort: "",
    });

    const url = new URL(global.fetch.mock.calls[0][0]);
    expect(url.pathname).toBe("/recipes/complexSearch");
    expect(url.searchParams.get("apiKey")).toBe("abc123");
    expect(url.searchParams.get("query")).toBe("pasta");
    expect(url.searchParams.get("number")).toBe(String(PAGE_SIZE));
    expect(url.searchParams.has("sort")).toBe(false);
  });

  it("includes the diet param when provided", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({ results: [], totalResults: 0 }) });

    await searchRecipes({
      apiKey: "k", dishQuery: "", ingredientsQuery: "", cuisine: "", diet: "vegan", sort: "",
    });

    const url = new URL(global.fetch.mock.calls[0][0]);
    expect(url.searchParams.get("diet")).toBe("vegan");
  });

  it("defaults sort to popularity when no filters are given", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({ results: [], totalResults: 0 }) });

    await searchRecipes({
      apiKey: "k", dishQuery: "", ingredientsQuery: "", cuisine: "", diet: "", sort: "",
    });

    const url = new URL(global.fetch.mock.calls[0][0]);
    expect(url.searchParams.get("sort")).toBe("popularity");
  });

  it("throws with the API's error message on a failed response", async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ message: "You are not authorized." }),
    });

    await expect(
      searchRecipes({ apiKey: "bad", dishQuery: "", ingredientsQuery: "", cuisine: "", diet: "", sort: "" })
    ).rejects.toThrow("You are not authorized.");
  });

  it("falls back to a generic error message when the response has no JSON body", async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => { throw new Error("no body"); },
    });

    await expect(
      searchRecipes({ apiKey: "k", dishQuery: "", ingredientsQuery: "", cuisine: "", diet: "", sort: "" })
    ).rejects.toThrow("Search failed (status 500).");
  });

  it("forwards the abort signal to fetch", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({ results: [], totalResults: 0 }) });
    const controller = new AbortController();

    await searchRecipes({
      apiKey: "k", dishQuery: "", ingredientsQuery: "", cuisine: "", diet: "", sort: "",
      signal: controller.signal,
    });

    expect(global.fetch.mock.calls[0][1]).toEqual({ signal: controller.signal });
  });
});

describe("fetchRecipeDetails", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it("requests recipe information with a trimmed api key", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({ id: 5, title: "Soup" }) });

    await fetchRecipeDetails({ apiKey: " abc ", id: 5 });

    const url = new URL(global.fetch.mock.calls[0][0]);
    expect(url.pathname).toBe("/recipes/5/information");
    expect(url.searchParams.get("apiKey")).toBe("abc");
  });

  it("throws when the response is not ok", async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 404 });

    await expect(fetchRecipeDetails({ apiKey: "k", id: 999 })).rejects.toThrow(
      "Could not load this recipe (status 404)."
    );
  });
});
