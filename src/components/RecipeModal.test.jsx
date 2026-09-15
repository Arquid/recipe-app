import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { axe } from "vitest-axe";
import RecipeModal from "./RecipeModal";

const detail = {
  id: 1,
  title: "Mock Lasagna",
  image: "https://placehold.co/640x300",
  readyInMinutes: 45,
  servings: 4,
  sourceUrl: "https://example.com/mock-lasagna",
  extendedIngredients: [{ id: 1, original: "200g pasta sheets" }],
  analyzedInstructions: [{ steps: [{ number: 1, step: "Layer and bake." }] }],
};

describe("RecipeModal", () => {
  beforeEach(() => {
    window.print = vi.fn();
  });

  it("renders the recipe title, ingredients, and instructions", () => {
    render(<RecipeModal detail={detail} loading={false} error={null} onClose={vi.fn()} />);

    expect(screen.getByText("Mock Lasagna")).toBeTruthy();
    expect(screen.getByText("200g pasta sheets")).toBeTruthy();
    expect(screen.getByText("Layer and bake.")).toBeTruthy();
  });

  it("does not render a share button when the recipe has no source url", () => {
    render(
      <RecipeModal
        detail={{ ...detail, sourceUrl: undefined, spoonacularSourceUrl: undefined }}
        loading={false}
        error={null}
        onClose={vi.fn()}
      />
    );

    expect(screen.queryByRole("button", { name: /share/i })).toBeNull();
  });

  it("calls window.print when the Print button is clicked", () => {
    render(<RecipeModal detail={detail} loading={false} error={null} onClose={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: /print/i }));

    expect(window.print).toHaveBeenCalledTimes(1);
  });

  it("closes when the overlay backdrop is clicked but not when the modal body is clicked", () => {
    const onClose = vi.fn();
    render(<RecipeModal detail={detail} loading={false} error={null} onClose={onClose} />);

    fireEvent.click(screen.getByText("Mock Lasagna"));
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("dialog"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("moves focus into the modal on mount", () => {
    render(<RecipeModal detail={detail} loading={false} error={null} onClose={vi.fn()} />);

    expect(document.activeElement).toBe(screen.getByRole("dialog").firstChild);
  });

  it("closes on Escape", () => {
    const onClose = vi.fn();
    render(<RecipeModal detail={detail} loading={false} error={null} onClose={onClose} />);

    fireEvent.keyDown(document, { key: "Escape" });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("traps Tab focus inside the modal, wrapping in both directions", () => {
    render(<RecipeModal detail={detail} loading={false} error={null} onClose={vi.fn()} />);

    const closeButton = screen.getByRole("button", { name: /close recipe details/i });
    const shareButton = screen.getByRole("button", { name: /share/i });

    shareButton.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(document.activeElement).toBe(closeButton);

    closeButton.focus();
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(shareButton);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<RecipeModal detail={detail} loading={false} error={null} onClose={vi.fn()} />);

    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("RecipeModal share behavior", () => {
  const originalClipboard = navigator.clipboard;

  afterEach(() => {
    delete navigator.share;
    Object.defineProperty(navigator, "clipboard", { value: originalClipboard, configurable: true });
  });

  it("shows a confirmation once the link is copied to the clipboard", async () => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      configurable: true,
    });

    render(<RecipeModal detail={detail} loading={false} error={null} onClose={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /share/i }));

    expect(await screen.findByRole("button", { name: /link copied/i })).toBeTruthy();
  });

  it("shows an error state when copying to the clipboard fails", async () => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: vi.fn().mockRejectedValue(new Error("denied")) },
      configurable: true,
    });

    render(<RecipeModal detail={detail} loading={false} error={null} onClose={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /share/i }));

    const errorButton = await screen.findByRole("button", { name: /couldn't copy/i });
    expect(errorButton.className).toContain("rs-modal-action-error");
  });

  it("uses the native share sheet when the Web Share API is available", async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    navigator.share = share;

    render(<RecipeModal detail={detail} loading={false} error={null} onClose={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /share/i }));

    await waitFor(() =>
      expect(share).toHaveBeenCalledWith({ title: detail.title, url: detail.sourceUrl })
    );
  });
});
