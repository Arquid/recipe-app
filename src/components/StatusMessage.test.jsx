import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LoadingIndicator, ErrorMessage, EmptyState } from "./StatusMessage";

describe("StatusMessage", () => {
  it("LoadingIndicator shows the given label", () => {
    render(<LoadingIndicator label="Searching…" />);
    expect(screen.getByText("Searching…")).toBeTruthy();
  });

  it("ErrorMessage renders nothing without a message", () => {
    const { container } = render(<ErrorMessage message={null} />);
    expect(container.firstChild).toBeNull();
  });

  it("ErrorMessage renders the message when provided", () => {
    render(<ErrorMessage message="Something broke" />);
    expect(screen.getByText("Something broke")).toBeTruthy();
  });

  it("EmptyState shows a default message", () => {
    render(<EmptyState />);
    expect(screen.getByText(/no recipes matched/i)).toBeTruthy();
  });

  it("EmptyState shows a custom message when provided", () => {
    render(<EmptyState message="Custom empty message" />);
    expect(screen.getByText("Custom empty message")).toBeTruthy();
  });
});
