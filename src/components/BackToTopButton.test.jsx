import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import BackToTopButton from "./BackToTopButton";

describe("BackToTopButton", () => {
  beforeEach(() => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: false });
    Object.defineProperty(window, "scrollY", { value: 0, configurable: true });
  });

  it("is hidden below the scroll threshold", () => {
    render(<BackToTopButton threshold={400} />);

    expect(screen.queryByRole("button", { name: /back to top/i })).toBeNull();
  });

  it("appears once scrolled past the threshold", () => {
    Object.defineProperty(window, "scrollY", { value: 500, configurable: true });
    render(<BackToTopButton threshold={400} />);
    fireEvent.scroll(window);

    expect(screen.getByRole("button", { name: /back to top/i })).toBeTruthy();
  });

  it("scrolls to the top when clicked", () => {
    Object.defineProperty(window, "scrollY", { value: 500, configurable: true });
    window.scrollTo = vi.fn();
    render(<BackToTopButton threshold={400} />);
    fireEvent.scroll(window);

    fireEvent.click(screen.getByRole("button", { name: /back to top/i }));

    expect(window.scrollTo).toHaveBeenCalledWith(expect.objectContaining({ top: 0 }));
  });
});
