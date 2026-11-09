import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getCachedDetail, setCachedDetail } from "./detailCache";

const KEY = "rs-detail-cache";

describe("detailCache", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns null for a recipe that was never cached", () => {
    expect(getCachedDetail(1)).toBeNull();
  });

  it("returns a cached recipe by numeric id", () => {
    setCachedDetail(42, { id: 42, title: "Soup" });

    expect(getCachedDetail(42)).toEqual({ id: 42, title: "Soup" });
  });

  it("keeps different recipes apart and overwrites the same id", () => {
    setCachedDetail(1, { id: 1, title: "Old" });
    setCachedDetail(2, { id: 2, title: "Other" });
    setCachedDetail(1, { id: 1, title: "New" });

    expect(getCachedDetail(1)).toEqual({ id: 1, title: "New" });
    expect(getCachedDetail(2)).toEqual({ id: 2, title: "Other" });
  });

  it("treats corrupted stored data as an empty cache and recovers on the next write", () => {
    localStorage.setItem(KEY, "not valid json");

    expect(getCachedDetail(1)).toBeNull();

    setCachedDetail(1, { id: 1, title: "Soup" });

    expect(getCachedDetail(1)).toEqual({ id: 1, title: "Soup" });
  });

  it("keeps only the 30 most recently saved recipes", () => {
    let tick = 0;
    vi.spyOn(Date, "now").mockImplementation(() => ++tick);

    for (let id = 1; id <= 32; id++) {
      setCachedDetail(id, { id });
    }

    expect(getCachedDetail(1)).toBeNull();
    expect(getCachedDetail(2)).toBeNull();
    expect(getCachedDetail(3)).toEqual({ id: 3 });
    expect(getCachedDetail(32)).toEqual({ id: 32 });
    expect(Object.keys(JSON.parse(localStorage.getItem(KEY)))).toHaveLength(30);
  });

  it("evicts by save time, so re-saving an old recipe keeps it", () => {
    let tick = 0;
    vi.spyOn(Date, "now").mockImplementation(() => ++tick);

    for (let id = 1; id <= 30; id++) {
      setCachedDetail(id, { id });
    }
    setCachedDetail(1, { id: 1, title: "Refreshed" });
    setCachedDetail(31, { id: 31 });

    expect(getCachedDetail(1)).toEqual({ id: 1, title: "Refreshed" });
    expect(getCachedDetail(2)).toBeNull();
  });

  it("does not throw when the browser refuses to store more data", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });

    expect(() => setCachedDetail(1, { id: 1 })).not.toThrow();
    expect(getCachedDetail(1)).toBeNull();
  });
});
