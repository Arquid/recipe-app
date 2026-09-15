import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import LoadMoreButton from "./LoadMoreButton";

describe("LoadMoreButton", () => {
  it("calls onClick when clicked", () => {
    const onClick = vi.fn();
    render(<LoadMoreButton onClick={onClick} loading={false} />);

    fireEvent.click(screen.getByRole("button"));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("shows a loading label and disables the button while loading", () => {
    render(<LoadMoreButton onClick={vi.fn()} loading={true} />);

    const button = screen.getByRole("button");
    expect(button.textContent).toContain("Loading");
    expect(button.disabled).toBe(true);
  });

  it("shows the default label and stays enabled when not loading", () => {
    render(<LoadMoreButton onClick={vi.fn()} loading={false} />);

    const button = screen.getByRole("button");
    expect(button.textContent).toContain("Show more recipes");
    expect(button.disabled).toBe(false);
  });
});
