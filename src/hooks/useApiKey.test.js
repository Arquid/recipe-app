import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useApiKey } from "./useApiKey";

describe("useApiKey", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts empty with remember off when nothing is stored", () => {
    const { result } = renderHook(() => useApiKey());
    expect(result.current.apiKey).toBe("");
    expect(result.current.remember).toBe(false);
  });

  it("does not persist the key to localStorage while remember is off", () => {
    const { result } = renderHook(() => useApiKey());
    act(() => result.current.setApiKey("secret"));
    expect(localStorage.getItem("rs-api-key")).toBeNull();
  });

  it("persists the key once remember is turned on", () => {
    const { result } = renderHook(() => useApiKey());
    act(() => result.current.setApiKey("secret"));
    act(() => result.current.setRemember(true));
    expect(localStorage.getItem("rs-api-key")).toBe("secret");
  });

  it("clears the stored key when remember is turned back off", () => {
    const { result } = renderHook(() => useApiKey());
    act(() => result.current.setApiKey("secret"));
    act(() => result.current.setRemember(true));
    act(() => result.current.setRemember(false));
    expect(localStorage.getItem("rs-api-key")).toBeNull();
  });

  it("loads a previously remembered key on mount", () => {
    localStorage.setItem("rs-api-key", "stored-key");
    const { result } = renderHook(() => useApiKey());
    expect(result.current.apiKey).toBe("stored-key");
    expect(result.current.remember).toBe(true);
  });
});
