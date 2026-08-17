import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useRecipeSearch } from "./useRecipeSearch";
import { searchRecipes, PAGE_SIZE } from "../api/spoonacular";

vi.mock("../api/spoonacular", async () => {
  const actual = await vi.importActual("../api/spoonacular");
  return {
    ...actual,
    searchRecipes: vi.fn(),
  };
});

const baseQuery = { dishQuery: "pasta", ingredientsQuery: "", cuisine: "", diet: "", sort: "" };

describe("useRecipeSearch", () => {
  beforeEach(() => {
    searchRecipes.mockReset();
  });

  it("refuses to search without an api key", async () => {
    searchRecipes.mockResolvedValue({ results: [], totalResults: 0 });
    const { result } = renderHook(() => useRecipeSearch(""));

    await act(async () => {
      await result.current.search(baseQuery);
    });

    expect(searchRecipes).not.toHaveBeenCalled();
    expect(result.current.error).toBe("Add your Spoonacular API key above before searching.");
  });

  it("populates recipes and totalResults on a successful search", async () => {
    searchRecipes.mockResolvedValue({ results: [{ id: 1 }, { id: 2 }], totalResults: 30 });
    const { result } = renderHook(() => useRecipeSearch("key"));

    await act(async () => {
      await result.current.search(baseQuery);
    });

    expect(result.current.recipes).toEqual([{ id: 1 }, { id: 2 }]);
    expect(result.current.totalResults).toBe(30);
    expect(result.current.hasSearched).toBe(true);
    expect(result.current.loading).toBe(false);
    expect(result.current.canLoadMore).toBe(true);
  });

  it("surfaces the error message when the search fails", async () => {
    searchRecipes.mockRejectedValue(new Error("Search failed (status 401)."));
    const { result } = renderHook(() => useRecipeSearch("key"));

    await act(async () => {
      await result.current.search(baseQuery);
    });

    expect(result.current.error).toBe("Search failed (status 401).");
    expect(result.current.recipes).toEqual([]);
  });

  it("loadMore appends results at the next offset using the last search params", async () => {
    searchRecipes.mockResolvedValueOnce({ results: [{ id: 1 }], totalResults: 20 });
    const { result } = renderHook(() => useRecipeSearch("key"));

    await act(async () => {
      await result.current.search(baseQuery);
    });

    searchRecipes.mockResolvedValueOnce({ results: [{ id: 2 }], totalResults: 20 });

    await act(async () => {
      await result.current.loadMore();
    });

    expect(result.current.recipes).toEqual([{ id: 1 }, { id: 2 }]);
    const secondCallArgs = searchRecipes.mock.calls[1][0];
    expect(secondCallArgs.offset).toBe(PAGE_SIZE);
    expect(secondCallArgs.dishQuery).toBe("pasta");
  });

  it("aborts the previous search when a new one starts before it resolves", () => {
    const signals = [];
    searchRecipes.mockImplementation(({ signal }) => {
      signals.push(signal);
      return new Promise(() => {});
    });

    const { result } = renderHook(() => useRecipeSearch("key"));

    act(() => { result.current.search(baseQuery); });
    act(() => { result.current.search({ ...baseQuery, dishQuery: "tacos" }); });

    expect(signals).toHaveLength(2);
    expect(signals[0].aborted).toBe(true);
    expect(signals[1].aborted).toBe(false);
  });

  it("ignores a stale, aborted search response and keeps the newer results", async () => {
    let rejectFirst;
    searchRecipes
      .mockImplementationOnce(() => new Promise((_resolve, reject) => { rejectFirst = reject; }))
      .mockImplementationOnce(() => Promise.resolve({ results: [{ id: 2 }], totalResults: 1 }));

    const { result } = renderHook(() => useRecipeSearch("key"));

    act(() => { result.current.search(baseQuery); });

    await act(async () => {
      result.current.search({ ...baseQuery, dishQuery: "tacos" });
      rejectFirst(Object.assign(new Error("Aborted"), { name: "AbortError" }));
      await Promise.resolve();
    });

    expect(result.current.error).toBe(null);
    expect(result.current.recipes).toEqual([{ id: 2 }]);
  });
});
