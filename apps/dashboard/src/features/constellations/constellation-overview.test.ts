import {describe, expect, it} from "vitest";

import {buildConstellationSummaries} from "./constellation-overview";

describe("buildConstellationSummaries", () => {
  it("aggregates readiness and payload activity by constellation", () => {
    const summaries = buildConstellationSummaries(
      [{id: "c1", name: "Mission Alpha", description: "Shared mission"}],
      [
        {id: "s1", name: "Alpha-1", status: "In Orbit", altitude: 520.4, constellation_id: "c1"},
        {id: "s2", name: "Alpha-2", status: "Planned", constellation_id: "c1"},
        {id: "s3", name: "Independent", status: "In Orbit"},
      ],
      [
        {id: "p1", status: "Active", satellite_id: "s1"},
        {id: "p2", status: "Inactive", satellite_id: "s1"},
      ],
    );

    expect(summaries).toEqual([
      {
        id: "c1",
        name: "Mission Alpha",
        description: "Shared mission",
        satellites: [
          {
            id: "s1",
            name: "Alpha-1",
            status: "In Orbit",
            altitudeKm: 520,
            payloadsActive: 1,
            payloadsTotal: 2,
          },
          {
            id: "s2",
            name: "Alpha-2",
            status: "Planned",
            altitudeKm: undefined,
            payloadsActive: 0,
            payloadsTotal: 0,
          },
        ],
        satellitesInOrbit: 1,
        payloadsActive: 1,
        payloadsTotal: 2,
        readinessPercent: 50,
      },
    ]);
  });
});
