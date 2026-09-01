import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchForm from "./SearchForm";

function renderForm(props = {}) {
  const handlers = {
    dishQuery: "",
    onDishQueryChange: vi.fn(),
    ingredientsQuery: "",
    onIngredientsQueryChange: vi.fn(),
    cuisine: "",
    onCuisineChange: vi.fn(),
    diet: "",
    onDietChange: vi.fn(),
    sort: "",
    onSortChange: vi.fn(),
    onSubmit: vi.fn((e) => e.preventDefault()),
  };
  render(<SearchForm {...handlers} {...props} />);
  return handlers;
}

describe("SearchForm", () => {
  it("calls onDishQueryChange when typing a dish name", () => {
    const { onDishQueryChange } = renderForm();

    fireEvent.change(screen.getByLabelText(/dish name/i), { target: { value: "lasagna" } });

    expect(onDishQueryChange).toHaveBeenCalledWith("lasagna");
  });

  it("calls onCuisineChange when selecting a cuisine", () => {
    const { onCuisineChange } = renderForm();

    fireEvent.change(screen.getByLabelText(/cuisine/i), { target: { value: "Italian" } });

    expect(onCuisineChange).toHaveBeenCalledWith("Italian");
  });

  it("calls onDietChange when selecting a diet", () => {
    const { onDietChange } = renderForm();

    fireEvent.change(screen.getByLabelText(/diet/i), { target: { value: "vegan" } });

    expect(onDietChange).toHaveBeenCalledWith("vegan");
  });

  it("calls onSubmit when the form is submitted", () => {
    const { onSubmit } = renderForm();

    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
