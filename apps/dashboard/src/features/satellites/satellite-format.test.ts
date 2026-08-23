import {describe, expect, it} from "vitest";

import {formatAltitudeKm, formatSpecKey, specEntries} from "./satellite-format";

describe("satellite formatters", () => {
  it("formats position values", () => {
    expect(formatAltitudeKm(1826.55)).toBe("1827 km");
    expect(formatSpecKey("max_power")).toBe("Max Power");
    expect(formatSpecKey("busMass")).toBe("Bus Mass");
  });

  it("reads spec objects and TLE lines", () => {
    expect(specEntries({mass: "227 kg", power: "5.0 kW"})).toEqual([
      {key: "Mass", value: "227 kg"},
      {key: "Power", value: "5.0 kW"},
    ]);
    expect(specEntries(null)).toEqual([]);
  });
});
