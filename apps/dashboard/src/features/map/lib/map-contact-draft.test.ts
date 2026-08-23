import {describe, expect, it} from "vitest";

import {
  applyMapSelectionToContactDraft,
  buildMapContactSeed,
  mapContactDraftMissing,
  utcDateTimeLocalValue,
} from "./map-contact-draft";
import type {FleetMapPoint} from "./map-points";

const station: FleetMapPoint = {
  id: "st1",
  kind: "station",
  name: "KSAT",
  latitude: 1,
  longitude: 2,
  href: "/stations/st1",
};

const satellite: FleetMapPoint = {
  id: "sat1",
  kind: "satellite",
  name: "YAM-5",
  latitude: 3,
  longitude: 4,
  href: "/satellites/sat1",
};

describe("utcDateTimeLocalValue", () => {
  it("formats an ISO UTC minute stamp", () => {
    expect(utcDateTimeLocalValue(new Date("2026-08-20T14:30:45.000Z"))).toBe("2026-08-20T14:30");
  });
});

describe("buildMapContactSeed", () => {
  it("prefills station or satellite from the map selection", () => {
    expect(
      buildMapContactSeed({
        now: new Date("2026-08-20T14:30:00.000Z"),
        selectedPoint: station,
        selectedSatelliteId: "",
        selectedStationId: "st1",
      }),
    ).toMatchObject({
      date: "2026-08-20T14:30",
      groundStation_id: "st1",
      satellite_id: "",
    });

    expect(
      buildMapContactSeed({
        now: new Date("2026-08-20T14:30:00.000Z"),
        selectedPoint: satellite,
        selectedSatelliteId: "sat1",
        selectedStationId: "",
      }),
    ).toMatchObject({
      satellite_id: "sat1",
      groundStation_id: "",
    });
  });
});

describe("applyMapSelectionToContactDraft", () => {
  it("updates asset ids and clears payload when satellite changes", () => {
    const values = buildMapContactSeed({
      selectedSatelliteId: "sat1",
      selectedStationId: "st1",
    });
    values.payload_id = "p1";

    const next = applyMapSelectionToContactDraft(values, {
      selectedSatelliteId: "sat2",
      selectedStationId: "st1",
    });

    expect(next.satellite_id).toBe("sat2");
    expect(next.payload_id).toBe("");
    expect(next.groundStation_id).toBe("st1");
  });
});

describe("mapContactDraftMissing", () => {
  it("lists required fields still empty", () => {
    const values = buildMapContactSeed({
      selectedSatelliteId: "",
      selectedStationId: "",
    });
    expect(mapContactDraftMissing(values)).toEqual(
      expect.arrayContaining(["station", "satellite", "operator"]),
    );

    values.groundStation_id = "st1";
    values.satellite_id = "sat1";
    values.employee_id = "e1";
    expect(mapContactDraftMissing(values)).toEqual([]);
  });
});
