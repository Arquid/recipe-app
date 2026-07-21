import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFavorites } from "./useFavorites";

const recipe = { id: 1, title: "Lasagna", image: "img.jpg", cuisines: ["Italian"] };
const recipe2 = { id: 2, title: "Tacos", image: "img2.jpg", cuisines: ["Mexican"] };

describe("useFavorites", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts empty when localStorage has no favorites", () => {
    const { result } = renderHook(() => useFavorites());
    expect(result.current.favorites).toEqual([]);
    expect(result.current.isFavorite(1)).toBe(false);
  });

  it("adds a recipe to favorites", () => {
    const { result } = renderHook(() => useFavorites());
    act(() => result.current.toggleFavorite(recipe));
    expect(result.current.favorites).toEqual([recipe]);
    expect(result.current.isFavorite(1)).toBe(true);
  });

  it("removes a recipe that is already favorited", () => {
    const { result } = renderHook(() => useFavorites());
    act(() => result.current.toggleFavorite(recipe));
    act(() => result.current.toggleFavorite(recipe));
    expect(result.current.favorites).toEqual([]);
    expect(result.current.isFavorite(1)).toBe(false);
  });

  it("persists favorites to localStorage", () => {
    const { result } = renderHook(() => useFavorites());
    act(() => result.current.toggleFavorite(recipe));
    expect(JSON.parse(localStorage.getItem("rs-favorites"))).toEqual([recipe]);
  });

  it("loads existing favorites from localStorage on mount", () => {
    localStorage.setItem("rs-favorites", JSON.stringify([recipe2]));
    const { result } = renderHook(() => useFavorites());
    expect(result.current.favorites).toEqual([recipe2]);
    expect(result.current.isFavorite(2)).toBe(true);
  });

  it("keeps a stable toggleFavorite reference across re-renders", () => {
    const { result, rerender } = renderHook(() => useFavorites());
    const first = result.current.toggleFavorite;
    rerender();
    expect(result.current.toggleFavorite).toBe(first);
  });
});
