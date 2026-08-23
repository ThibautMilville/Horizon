import {describe, expect, it} from "vitest";

import {buildSatellitePasses, hasScheduleConflict} from "./satellite-pass";

const satellite = {
  id: "sat-1",
  name: "Starlink-1",
  tle: {
    line1: "1    11U 59001A   22053.83197560  .00000847  00000-0  45179-3 0  9996",
    line2: "2    11  32.8647 264.6509 1466352 126.0358 248.5175 11.85932318689790",
  },
};

describe("satellite pass planning", () => {
  it("detects contact conflicts for either the satellite or station", () => {
    const at = new Date("2022-02-23T12:00:00.000Z");
    const contacts = [
      {
        date: "2022-02-23T12:10:00.000Z",
        satellite_id: "sat-2",
        groundStation_id: "station-1",
      },
    ];

    expect(hasScheduleConflict(contacts, "sat-1", "station-1", at)).toBe(true);
    expect(hasScheduleConflict(contacts, "sat-1", "station-2", at)).toBe(false);
  });

  it("returns bounded, chronological pass opportunities", () => {
    const passes = buildSatellitePasses(
      satellite,
      [
        {
          id: "station-1",
          name: "Equatorial station",
          latitude: 0,
          longitude: 0,
          status: "Online",
        },
      ],
      [],
      {start: new Date("2022-02-23T00:00:00.000Z"), windowHours: 48, limit: 3},
    );

    expect(passes.length).toBeGreaterThan(0);
    expect(passes.length).toBeLessThanOrEqual(3);
    expect(passes[0]).toMatchObject({
      satelliteId: "sat-1",
      stationId: "station-1",
      recommended: true,
      conflict: false,
    });
    expect(Date.parse(passes[0]?.los ?? "")).toBeGreaterThan(Date.parse(passes[0]?.aos ?? ""));
  });

  it("returns no opportunities without a usable TLE", () => {
    expect(buildSatellitePasses({id: "sat-1", name: "No TLE"}, [], [])).toEqual([]);
  });
});
