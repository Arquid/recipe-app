import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import RecipeGrid from "./RecipeGrid";

const recipes = [
  { id: 1, title: "Recipe A", image: "a.jpg", cuisines: ["Italian"] },
  { id: 2, title: "Recipe B", image: "b.jpg", cuisines: ["Mexican"] },
];

describe("RecipeGrid", () => {
  it("renders a card for each recipe", () => {
    render(
      <RecipeGrid recipes={recipes} onSelectRecipe={vi.fn()} isFavorite={() => false} onToggleFavorite={vi.fn()} />
    );

    expect(screen.getByText("Recipe A")).toBeTruthy();
    expect(screen.getByText("Recipe B")).toBeTruthy();
  });

  it("passes each recipe's own favorite state to its card", () => {
    render(
      <RecipeGrid
        recipes={recipes}
        onSelectRecipe={vi.fn()}
        isFavorite={(id) => id === 2}
        onToggleFavorite={vi.fn()}
      />
    );

    expect(screen.getByRole("button", { name: /add to favorites/i })).toBeTruthy();
    expect(screen.getByRole("button", { name: /remove from favorites/i })).toBeTruthy();
  });

  it("calls onSelectRecipe with the clicked recipe's id", () => {
    const onSelectRecipe = vi.fn();
    render(
      <RecipeGrid recipes={recipes} onSelectRecipe={onSelectRecipe} isFavorite={() => false} onToggleFavorite={vi.fn()} />
    );

    fireEvent.click(screen.getByText("Recipe B"));

    expect(onSelectRecipe).toHaveBeenCalledWith(2);
  });
});
