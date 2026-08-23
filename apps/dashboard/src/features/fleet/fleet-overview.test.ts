import {describe, expect, it} from "vitest";

import {
  countSatellitesInOrbit,
  isAttentionReport,
  isAttentionStation,
  isUnhealthySatellite,
} from "@/shared/lib/status-tone";

import {
  buildAttentionQueue,
  buildSatelliteReadiness,
  buildStationNetworkHealth,
  countStationsOnline,
  countUpcomingContacts,
  fleetCounts,
  isRecentAttentionReport,
  metaCount,
  type AttentionItem,
} from "./fleet-overview";

describe("fleet attention classifiers", () => {
  it("flags planned and decommissioned satellites", () => {
    expect(isUnhealthySatellite("In Orbit")).toBe(false);
    expect(isUnhealthySatellite("Planned")).toBe(true);
    expect(isUnhealthySatellite("Decommissioned")).toBe(true);
  });

  it("flags offline, error, and maintenance stations", () => {
    expect(isAttentionStation("Online")).toBe(false);
    expect(isAttentionStation("Unknown")).toBe(false);
    expect(isAttentionStation("Offline")).toBe(true);
    expect(isAttentionStation("Error")).toBe(true);
    expect(isAttentionStation("Maintenance")).toBe(true);
  });

  it("flags incident and issue reports", () => {
    expect(isAttentionReport("Maintenance")).toBe(false);
    expect(isAttentionReport("Incident")).toBe(true);
    expect(isAttentionReport("Issue")).toBe(true);
  });

  it("only treats recent incident reports as current attention", () => {
    const now = new Date("2026-08-22T12:00:00.000Z");
    expect(
      isRecentAttentionReport(
        {id: "recent", title: "Recent issue", type: "Issue", date: "2026-08-20"},
        now,
      ),
    ).toBe(true);
    expect(
      isRecentAttentionReport(
        {id: "old", title: "Old issue", type: "Issue", date: "2024-01-20"},
        now,
      ),
    ).toBe(false);
  });
});

describe("fleet analytics", () => {
  it("orders satellite readiness and stacks station health by network", () => {
    const satellites = [
      {id: "s1", name: "One", status: "In Orbit"},
      {id: "s2", name: "Two", status: "Planned"},
      {id: "s3", name: "Three", status: "In Orbit"},
    ];
    const stations = [
      {id: "g1", name: "Hawaii", status: "Offline", network: "KSAT"},
      {id: "g2", name: "Svalbard", status: "Online", network: "KSAT"},
      {id: "g3", name: "Landsat", status: "Online", network: "NASA"},
      {id: "g4", name: "White Sands", status: "Error", network: "NASA"},
    ];

    expect(buildSatelliteReadiness(satellites)).toEqual([
      {status: "In Orbit", count: 2},
      {status: "Planned", count: 1},
    ]);
    expect(buildStationNetworkHealth(stations)).toEqual([
      {network: "KSAT", Online: 1, Offline: 1, Error: 0, Maintenance: 0, Unknown: 0},
      {network: "NASA", Online: 1, Offline: 0, Error: 1, Maintenance: 0, Unknown: 0},
    ]);
    expect(countSatellitesInOrbit(satellites)).toBe(2);
    expect(countStationsOnline(stations)).toBe(2);
    expect(
      [
        {id: "p1", status: "Active"},
        {id: "p2", status: "Inactive"},
      ].filter((payload) => payload.status === "Active").length,
    ).toBe(1);
    expect(
      countUpcomingContacts(
        [
          {id: "c1", date: "2099-01-01"},
          {id: "c2", date: "2000-01-01"},
        ],
        new Date("2024-01-01"),
      ),
    ).toBe(1);
  });
});

describe("buildAttentionQueue", () => {
  it("builds linked attention rows from the three collections", () => {
    const queue = buildAttentionQueue(
      [
        {id: "s1", name: "YAM-5", status: "Planned"},
        {id: "s2", name: "Starlink-1", status: "In Orbit"},
      ],
      [
        {id: "g1", name: "KSAT Hawaii", status: "Offline"},
        {id: "g2", name: "KSAT Svalbard", status: "Online"},
      ],
      [
        {id: "r1", title: "Satellite Data Lost", type: "Incident", date: "2026-08-20"},
        {id: "r2", title: "Satellite Maintenance", type: "Maintenance", date: "2026-08-20"},
      ],
      new Date("2026-08-22"),
    );

    expect(queue.map((item) => item.id)).toEqual(["s1", "g1", "r1"]);
    expect(queue[0]).toMatchObject({href: "/satellites/s1", tone: "warn", reason: "Planned"});
    expect(queue[1]).toMatchObject({href: "/stations/g1", tone: "danger", reason: "Offline"});
    expect(queue[2]).toMatchObject({href: "/reports/r1", tone: "danger", reason: "Incident"});
  });
});

describe("fleetCounts", () => {
  it("uses metadata totals and operational rollups", () => {
    const attention: AttentionItem[] = [
      {
        id: "a",
        href: "/satellites",
        name: "YAM-5",
        kind: "satellite",
        reason: "Planned",
        tone: "warn",
      },
    ];
    expect(metaCount(undefined)).toBe(0);
    expect(metaCount({count: 9})).toBe(9);
    expect(fleetCounts(7, 4, 9, 5, 8, 11, 2, attention)).toEqual({
      satellites: 7,
      satellitesInOrbit: 4,
      stations: 9,
      stationsOnline: 5,
      payloadsActive: 8,
      payloadsTotal: 11,
      contactsUpcoming: 2,
      attention: 1,
    });
  });
});
