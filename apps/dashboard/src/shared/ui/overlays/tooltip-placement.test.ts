import {describe, expect, it} from "vitest";

import {chooseTooltipCoords} from "./tooltip-placement";

describe("chooseTooltipCoords", () => {
  const tip = {tipWidth: 120, tipHeight: 32, viewportWidth: 1000, viewportHeight: 800};

  it("prefers bottom when there is room", () => {
    const coords = chooseTooltipCoords({
      ...tip,
      prefer: "bottom",
      trigger: {top: 40, right: 520, bottom: 72, left: 480, width: 40, height: 32},
    });
    expect(coords.placement).toBe("bottom");
    expect(coords.top).toBe(80);
  });

  it("flips to top near the bottom edge", () => {
    const coords = chooseTooltipCoords({
      ...tip,
      prefer: "bottom",
      trigger: {top: 760, right: 520, bottom: 792, left: 480, width: 40, height: 32},
    });
    expect(coords.placement).toBe("top");
  });

  it("uses a side when vertical space is tight", () => {
    const coords = chooseTooltipCoords({
      tipWidth: 120,
      tipHeight: 80,
      viewportWidth: 400,
      viewportHeight: 120,
      prefer: "bottom",
      trigger: {top: 20, right: 60, bottom: 52, left: 20, width: 40, height: 32},
    });
    expect(coords.placement).toBe("right");
  });
});
