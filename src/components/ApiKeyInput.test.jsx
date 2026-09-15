import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import ApiKeyInput from "./ApiKeyInput";

describe("ApiKeyInput", () => {
  it("calls onChange when typing the api key", () => {
    const onChange = vi.fn();
    render(<ApiKeyInput value="" onChange={onChange} remember={false} onRememberChange={vi.fn()} />);

    fireEvent.change(screen.getByLabelText(/spoonacular api key/i), { target: { value: "abc123" } });

    expect(onChange).toHaveBeenCalledWith("abc123");
  });

  it("calls onRememberChange when the checkbox is toggled", () => {
    const onRememberChange = vi.fn();
    render(<ApiKeyInput value="" onChange={vi.fn()} remember={false} onRememberChange={onRememberChange} />);

    fireEvent.click(screen.getByRole("checkbox"));

    expect(onRememberChange).toHaveBeenCalledWith(true);
  });

  it("reflects the remember checkbox state", () => {
    render(<ApiKeyInput value="" onChange={vi.fn()} remember={true} onRememberChange={vi.fn()} />);

    expect(screen.getByRole("checkbox").checked).toBe(true);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <ApiKeyInput value="" onChange={vi.fn()} remember={false} onRememberChange={vi.fn()} />
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
