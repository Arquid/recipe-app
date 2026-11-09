import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useRecipeDetails } from "./useRecipeDetails";
import { fetchRecipeDetails } from "../api/spoonacular";

vi.mock("../api/spoonacular", () => ({
  fetchRecipeDetails: vi.fn(),
}));

describe("useRecipeDetails", () => {
  beforeEach(() => {
    fetchRecipeDetails.mockReset();
  });

  it("aborts the previous request's signal when a new recipe is opened", () => {
    const signals = [];
    fetchRecipeDetails.mockImplementation(({ signal }) => {
      signals.push(signal);
      return new Promise(() => {}); // stays pending, like a slow in-flight request
    });

    const { result } = renderHook(() => useRecipeDetails("key"));

    act(() => { result.current.open(1); });
    act(() => { result.current.open(2); });

    expect(signals).toHaveLength(2);
    expect(signals[0].aborted).toBe(true);
    expect(signals[1].aborted).toBe(false);
  });

  it("aborts the in-flight request's signal when closing", () => {
    let capturedSignal;
    fetchRecipeDetails.mockImplementation(({ signal }) => {
      capturedSignal = signal;
      return new Promise(() => {});
    });

    const { result } = renderHook(() => useRecipeDetails("key"));

    act(() => { result.current.open(1); });
    act(() => { result.current.close(); });

    expect(capturedSignal.aborted).toBe(true);
    expect(result.current.selectedId).toBe(null);
  });

  it("ignores a stale, aborted response and keeps the newer recipe's data", async () => {
    let rejectFirst;
    fetchRecipeDetails
      .mockImplementationOnce(() => new Promise((_resolve, reject) => { rejectFirst = reject; }))
      .mockImplementationOnce(() => Promise.resolve({ id: 2, title: "Recipe B" }));

    const { result } = renderHook(() => useRecipeDetails("key"));

    act(() => { result.current.open(1); });

    await act(async () => {
      result.current.open(2);
      rejectFirst(Object.assign(new Error("Aborted"), { name: "AbortError" }));
      await Promise.resolve();
    });

    expect(result.current.error).toBe(null);
    expect(result.current.detail).toEqual({ id: 2, title: "Recipe B" });
    expect(result.current.selectedId).toBe(2);
  });

  it("shows the error message when the request fails", async () => {
    fetchRecipeDetails.mockRejectedValue(
      new Error("Could not load this recipe (status 404).")
    );
    const { result } = renderHook(() => useRecipeDetails("key"));

    await act(async () => {
      await result.current.open(1);
    });

    expect(result.current.error).toBe("Could not load this recipe (status 404).");
    expect(result.current.loading).toBe(false);
  });

  it("explains that an api key is needed instead of calling the API", async () => {
    const { result } = renderHook(() => useRecipeDetails(""));

    await act(async () => {
      await result.current.open(1);
    });

    expect(fetchRecipeDetails).not.toHaveBeenCalled();
    expect(result.current.error).toBe("Add your Spoonacular API key to open this recipe.");
    expect(result.current.loading).toBe(false);
    expect(result.current.selectedId).toBe(1);
  });

  it("treats a whitespace-only api key as missing", async () => {
    const { result } = renderHook(() => useRecipeDetails("   "));

    await act(async () => {
      await result.current.open(1);
    });

    expect(fetchRecipeDetails).not.toHaveBeenCalled();
    expect(result.current.error).toBe("Add your Spoonacular API key to open this recipe.");
  });
});
