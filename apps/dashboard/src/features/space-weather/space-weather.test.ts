import {describe, expect, it} from "vitest";

import {classifySpaceWeather, formatPlanetaryKp, parseNoaaKpResponse} from "./space-weather";

describe("NOAA planetary K-index", () => {
  it("parses the current NOAA object payload", () => {
    expect(
      parseNoaaKpResponse([
        {time_tag: "2026-08-15T00:00:00", Kp: 1.33, a_running: 5, station_count: 8},
        {time_tag: "2026-08-15T12:00:00", Kp: 2, a_running: 7, station_count: 8},
      ]),
    ).toEqual({
      observedAt: "2026-08-15T12:00:00.000Z",
      kp: 2,
      scale: null,
      level: "quiet",
    });
  });

  it("parses the legacy tabular payload", () => {
    expect(
      parseNoaaKpResponse([
        ["time_tag", "Kp", "a_running", "station_count"],
        ["2026-08-22 09:00:00.000", "3.33", "10", "8"],
        ["2026-08-22 12:00:00.000", "5.67", "25", "8"],
      ]),
    ).toEqual({
      observedAt: "2026-08-22T12:00:00.000Z",
      kp: 5.67,
      scale: "G1",
      level: "storm",
    });
  });

  it("classifies quiet, active, and storm conditions", () => {
    expect(classifySpaceWeather(2)).toBe("quiet");
    expect(classifySpaceWeather(4)).toBe("active");
    expect(classifySpaceWeather(5)).toBe("storm");
  });

  it("formats planetary Kp with two decimals like NOAA SWPC", () => {
    expect(formatPlanetaryKp(2)).toBe("2.00");
    expect(formatPlanetaryKp(1.33)).toBe("1.33");
    expect(formatPlanetaryKp(5.67)).toBe("5.67");
  });

  it("rejects unexpected payloads", () => {
    expect(parseNoaaKpResponse({Kp: 4})).toBeNull();
    expect(
      parseNoaaKpResponse([
        ["date", "value"],
        ["bad", "data"],
      ]),
    ).toBeNull();
  });

  it.each([null, undefined, "", "   ", -0.01, 9.01])("rejects invalid Kp values: %s", (kp) => {
    expect(parseNoaaKpResponse([{time_tag: "2026-08-15T12:00:00", Kp: kp}])).toBeNull();
  });

  it.each([0, 9])("accepts Kp domain boundary: %s", (kp) => {
    expect(parseNoaaKpResponse([{time_tag: "2026-08-15T12:00:00", Kp: kp}])?.kp).toBe(kp);
  });
});
