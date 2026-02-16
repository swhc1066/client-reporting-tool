import { describe, it, expect } from "vitest";
import { DEFAULT_SCREEN_ORDER } from "./screen-order";
import type { ScreenId } from "./screen-order";

const VALID_IDS: ScreenId[] = [
  "overview",
  "allocation",
  "performance",
  "summary",
];

describe("screen order", () => {
  it("has four screens", () => {
    expect(DEFAULT_SCREEN_ORDER).toHaveLength(4);
  });

  it("each screen has id, label, and component", () => {
    for (const screen of DEFAULT_SCREEN_ORDER) {
      expect(VALID_IDS).toContain(screen.id);
      expect(typeof screen.label).toBe("string");
      expect(screen.label.length).toBeGreaterThan(0);
      expect(typeof screen.component).toBe("function");
    }
  });

  it("screen ids are unique and in fixed order", () => {
    const ids = DEFAULT_SCREEN_ORDER.map((s) => s.id);
    expect(ids).toEqual(["overview", "allocation", "performance", "summary"]);
  });
});
