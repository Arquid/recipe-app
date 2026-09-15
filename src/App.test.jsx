import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";
import { searchRecipes, fetchRecipeDetails } from "./api/spoonacular";

vi.mock("./api/spoonacular", async () => {
  const actual = await vi.importActual("./api/spoonacular");
  return {
    ...actual,
    searchRecipes: vi.fn(),
    fetchRecipeDetails: vi.fn(),
  };
});

describe("App (integration)", () => {
  beforeEach(() => {
    localStorage.clear();
    searchRecipes.mockReset();
    fetchRecipeDetails.mockReset();
  });

  it("lets a user search, open a recipe, and close it again", async () => {
    searchRecipes.mockResolvedValue({
      results: [{ id: 1, title: "Mock Lasagna", image: "img.jpg", cuisines: ["Italian"] }],
      totalResults: 1,
    });
    fetchRecipeDetails.mockResolvedValue({
      id: 1,
      title: "Mock Lasagna",
      extendedIngredients: [{ id: 1, original: "Pasta sheets" }],
      analyzedInstructions: [{ steps: [{ number: 1, step: "Bake it." }] }],
    });

    render(<App />);

    fireEvent.change(screen.getByLabelText(/spoonacular api key/i), { target: { value: "test-key" } });
    fireEvent.change(screen.getByLabelText(/dish name/i), { target: { value: "lasagna" } });
    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    await waitFor(() => expect(searchRecipes).toHaveBeenCalled());
    expect(await screen.findByText("Mock Lasagna")).toBeTruthy();

    fireEvent.click(document.querySelector(".rs-card"));

    expect(await screen.findByText("Pasta sheets")).toBeTruthy();

    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => expect(screen.queryByText("Pasta sheets")).toBeNull());
  });

  it("shows an error and does not search when no api key is provided", async () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText(/dish name/i), { target: { value: "tacos" } });
    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    expect(await screen.findByText(/add your spoonacular api key/i)).toBeTruthy();
    expect(searchRecipes).not.toHaveBeenCalled();
  });

  it("lets a user save a search result as a favorite and view it in the favorites list", async () => {
    searchRecipes.mockResolvedValue({
      results: [{ id: 7, title: "Mock Tacos", image: "img.jpg", cuisines: ["Mexican"] }],
      totalResults: 1,
    });

    render(<App />);

    fireEvent.change(screen.getByLabelText(/spoonacular api key/i), { target: { value: "test-key" } });
    fireEvent.change(screen.getByLabelText(/dish name/i), { target: { value: "tacos" } });
    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    await screen.findByText("Mock Tacos");
    fireEvent.click(screen.getByRole("button", { name: /add to favorites/i }));

    fireEvent.click(screen.getByRole("button", { name: /my favorites/i }));

    expect(screen.getByText("Mock Tacos")).toBeTruthy();
    expect(screen.getByRole("button", { name: /remove from favorites/i })).toBeTruthy();
  });
});
