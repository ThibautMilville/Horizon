import {describe, expect, it} from "vitest";

import {buildGlobalSearchItems} from "./global-search";

describe("buildGlobalSearchItems", () => {
  it("creates navigable, typed results for every supported business entity", () => {
    const results = buildGlobalSearchItems({
      allSatellites: [{id: "s1", name: "Sat One", status: "active", manufacturer: "Loft"}],
      allGroundStations: [{id: "g1", name: "GS One", status: "online", network: "KSAT"}],
      allPayloads: [{id: "p1", name: "Camera", status: "ready", category: "EO"}],
      allCustomers: [{id: "c1", name: "Acme", email: "ops@acme.test"}],
      allContacts: [
        {
          id: "ct1",
          date: "2026-08-22T12:00:00.000Z",
          type: "payload",
          Satellite: {name: "Sat One"},
          GroundStation: {name: "GS One"},
        },
      ],
      allReports: [{id: "r1", title: "Pass anomaly", type: "incident", date: "2026-08-22"}],
    });

    expect(results.map(({kind, href}) => ({kind, href}))).toEqual([
      {kind: "satellite", href: "/satellites/s1"},
      {kind: "station", href: "/stations/g1"},
      {kind: "payload", href: "/payloads/p1"},
      {kind: "customer", href: "/customers/c1"},
      {kind: "contact", href: "/contacts/ct1"},
      {kind: "report", href: "/reports/r1"},
    ]);
    expect(results[4]?.title).toContain("Sat One");
  });
});
