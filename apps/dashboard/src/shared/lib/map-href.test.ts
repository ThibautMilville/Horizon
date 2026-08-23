import {describe, expect, it} from "vitest";

import {
  buildMapShareUrl,
  mapAssetHref,
  mapPath,
  mapRelatedAssetHref,
  mapSatelliteHref,
  mapStationHref,
} from "./map-href";

describe("map-href", () => {
  it("builds map deep links", () => {
    expect(mapSatelliteHref("sat-1")).toBe("/map?satellite=sat-1");
    expect(mapStationHref("gs-1")).toBe("/map?station=gs-1");
    expect(mapAssetHref("satellite", "sat-1")).toBe("/map?satellite=sat-1");
    expect(mapAssetHref("station", "gs-1")).toBe("/map?station=gs-1");
    expect(mapRelatedAssetHref("sat-1", "gs-1")).toBe("/map?satellite=sat-1");
    expect(mapRelatedAssetHref(undefined, "gs-1")).toBe("/map?station=gs-1");
    expect(mapRelatedAssetHref()).toBeUndefined();
  });

  it("encodes ids in map hrefs", () => {
    expect(mapSatelliteHref("a b")).toBe("/map?satellite=a+b");
  });

  it("adds focus for shareable deep links", () => {
    expect(mapSatelliteHref("sat-1", {focus: true})).toBe("/map?satellite=sat-1&focus=selection");
    expect(mapStationHref("gs-1", {focus: true})).toBe("/map?station=gs-1&focus=selection");
  });

  it("builds map paths from search params", () => {
    expect(mapPath({satellite: "sat-1", focus: "selection"})).toBe(
      "/map?satellite=sat-1&focus=selection",
    );
    expect(mapPath()).toBe("/map");
  });

  it("builds absolute share urls", () => {
    const originalOrigin = window.location.origin;
    Object.defineProperty(window, "location", {
      configurable: true,
      value: {origin: "https://horizon.test"},
    });
    expect(buildMapShareUrl("satellite", "sat-1")).toBe(
      "https://horizon.test/map?satellite=sat-1&focus=selection",
    );
    Object.defineProperty(window, "location", {
      configurable: true,
      value: {origin: originalOrigin},
    });
  });
});
