import {describe, expect, it} from "vitest";

import {formatDegrees} from "./coordinates";

describe("formatDegrees", () => {
  it("formats a coordinate with two decimals", () => {
    expect(formatDegrees(23.72007)).toBe("23.72 deg");
  });
});
