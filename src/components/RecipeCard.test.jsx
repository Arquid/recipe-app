import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import RecipeCard from "./RecipeCard";

const recipe = {
  id: 42,
  title: "Mock Tacos",
  image: "https://placehold.co/400x300",
  cuisines: ["Mexican"],
};

function renderCard(props = {}) {
  const onSelect = vi.fn();
  const onToggleFavorite = vi.fn();
  render(
    <RecipeCard
      recipe={recipe}
      onSelect={onSelect}
      isFavorite={false}
      onToggleFavorite={onToggleFavorite}
      {...props}
    />
  );
  return { onSelect, onToggleFavorite, card: document.querySelector(".rs-card") };
}

describe("RecipeCard", () => {
  it("calls onSelect with the recipe id when the card is clicked", () => {
    const { onSelect, card } = renderCard();

    fireEvent.click(card);

    expect(onSelect).toHaveBeenCalledWith(42);
  });

  it("triggers onSelect on Enter and Space keydown", () => {
    const { onSelect, card } = renderCard();

    fireEvent.keyDown(card, { key: "Enter" });
    fireEvent.keyDown(card, { key: " " });

    expect(onSelect).toHaveBeenCalledTimes(2);
    expect(onSelect).toHaveBeenCalledWith(42);
  });

  it("toggles favorite without triggering onSelect (click does not propagate to the card)", () => {
    const { onSelect, onToggleFavorite } = renderCard();

    fireEvent.click(screen.getByRole("button", { name: /add to favorites/i }));

    expect(onToggleFavorite).toHaveBeenCalledWith(recipe);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("reflects the favorited state in the button label and styling", () => {
    renderCard({ isFavorite: true });

    const favoriteButton = screen.getByRole("button", { name: /remove from favorites/i });
    expect(favoriteButton.className).toContain("rs-favorite-active");
  });
});
