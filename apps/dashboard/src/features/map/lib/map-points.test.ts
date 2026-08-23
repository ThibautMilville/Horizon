import {describe, expect, it} from "vitest";

import {
  buildFleetMapPoints,
  defaultMapCenter,
  mapPointIdSets,
  parseCoordinates,
  resolveSelectedMapPoint,
} from "./map-points";

describe("parseCoordinates", () => {
  it("reads finite lat/lon pairs", () => {
    expect(parseCoordinates([77.875, 20.9752])).toEqual({
      latitude: 77.875,
      longitude: 20.9752,
    });
    expect(parseCoordinates(null)).toBeUndefined();
    expect(parseCoordinates([NaN, 1])).toBeUndefined();
    expect(parseCoordinates(["a", "b"])).toBeUndefined();
    expect(parseCoordinates([91, 1])).toBeUndefined();
    expect(parseCoordinates([1, 181])).toBeUndefined();
    expect(parseCoordinates([0, 0])).toEqual({latitude: 0, longitude: 0});
  });
});

describe("buildFleetMapPoints", () => {
  it("builds satellite and station markers with detail links", () => {
    const points = buildFleetMapPoints(
      [
        {id: "s1", name: "YAM-2", coordinates: [10, 20]},
        {id: "s2", name: "Bad", coordinates: null},
      ],
      [{id: "g1", name: "KSAT Hawaii", coordinates: [21.33, -158.14]}],
    );

    expect(points).toEqual([
      {
        id: "s1",
        kind: "satellite",
        name: "YAM-2",
        latitude: 10,
        longitude: 20,
        href: "/satellites/s1",
        status: undefined,
      },
      {
        id: "g1",
        kind: "station",
        name: "KSAT Hawaii",
        latitude: 21.33,
        longitude: -158.14,
        href: "/stations/g1",
        status: undefined,
      },
    ]);
  });
});

describe("defaultMapCenter", () => {
  it("averages points or falls back", () => {
    expect(defaultMapCenter([])).toEqual([20, 0]);
    expect(
      defaultMapCenter([
        {
          id: "a",
          kind: "satellite",
          name: "A",
          latitude: 10,
          longitude: 20,
          href: "/satellites/a",
        },
        {
          id: "b",
          kind: "station",
          name: "B",
          latitude: 30,
          longitude: 40,
          href: "/stations/b",
        },
      ]),
    ).toEqual([20, 30]);
  });
});

describe("resolveSelectedMapPoint", () => {
  const satellite = {
    id: "sat-1",
    kind: "satellite" as const,
    name: "Alpha",
    latitude: 1,
    longitude: 2,
    href: "/satellites/sat-1",
  };
  const station = {
    id: "gs-1",
    kind: "station" as const,
    name: "Ground",
    latitude: 3,
    longitude: 4,
    href: "/stations/gs-1",
  };

  it("prefers satellite selection over station", () => {
    expect(resolveSelectedMapPoint([satellite, station], "sat-1", "gs-1")).toEqual(satellite);
    expect(resolveSelectedMapPoint([satellite, station], "", "gs-1")).toEqual(station);
  });
});

describe("mapPointIdSets", () => {
  it("groups ids by point kind", () => {
    expect(
      mapPointIdSets([
        {
          id: "s1",
          kind: "satellite",
          name: "A",
          latitude: 0,
          longitude: 0,
          href: "/satellites/s1",
        },
        {
          id: "g1",
          kind: "station",
          name: "B",
          latitude: 0,
          longitude: 0,
          href: "/stations/g1",
        },
      ]),
    ).toEqual({
      satelliteIds: new Set(["s1"]),
      stationIds: new Set(["g1"]),
    });
  });
});
