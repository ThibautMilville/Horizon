import {describe, expect, it} from "vitest";

import {
  resolveMapSelectionIds,
  updateMapSelectionParams,
  writeMapSelectionParams,
} from "./map-selection";

describe("map-selection", () => {
  it("writes mutually exclusive selection params", () => {
    expect(writeMapSelectionParams({satelliteId: "sat-1", stationId: "gs-1"})).toEqual({
      satellite: "sat-1",
    });
    expect(writeMapSelectionParams({satelliteId: "", stationId: "gs-1"})).toEqual({
      station: "gs-1",
    });
    expect(writeMapSelectionParams({satelliteId: "", stationId: ""})).toEqual({});
  });

  it("resolves ids from the selected map point", () => {
    expect(
      resolveMapSelectionIds({
        selectedSatelliteId: "",
        selectedStationId: "",
        selectedPoint: {id: "sat-1", kind: "satellite"},
      }),
    ).toEqual({satelliteId: "sat-1", stationId: ""});
  });

  it("updates selection without dropping other map state", () => {
    const current = new URLSearchParams("satellite=sat-1&focus=selection&fit=fleet");
    expect(updateMapSelectionParams(current, {satelliteId: "", stationId: "gs-1"}).toString()).toBe(
      "focus=selection&fit=fleet&station=gs-1",
    );
    expect(current.toString()).toBe("satellite=sat-1&focus=selection&fit=fleet");
  });
});
