import {describe, expect, it} from "vitest";

import {
  buildGroundTrackSegments,
  groundTrackStartMs,
  sampleGroundTrack,
  splitTrackAtAntimeridian,
} from "./ground-track";

const sampleTle = {
  line1: "1    29U 60002B   22053.73599453  .00000075  00000-0  41992-4 0  9997",
  line2: "2    29  48.3791 284.6069 0024160 344.1103  15.9048 14.74533417309456",
};

describe("groundTrackStartMs", () => {
  it("refreshes the track anchor in five-minute buckets", () => {
    expect(groundTrackStartMs(Date.parse("2026-08-23T13:12:59.000Z"))).toBe(
      Date.parse("2026-08-23T13:10:00.000Z"),
    );
    expect(groundTrackStartMs(Date.parse("2026-08-23T13:15:00.000Z"))).toBe(
      Date.parse("2026-08-23T13:15:00.000Z"),
    );
  });
});

describe("sampleGroundTrack", () => {
  it("samples finite lat/lon points from a TLE", () => {
    const points = sampleGroundTrack(sampleTle, {
      start: new Date("2022-02-22T12:00:00.000Z"),
      hours: 1,
      stepMinutes: 10,
    });

    expect(points.length).toBeGreaterThan(5);
    expect(
      points.every(
        ([latitude, longitude]) => Number.isFinite(latitude) && Number.isFinite(longitude),
      ),
    ).toBe(true);
  });
});

describe("splitTrackAtAntimeridian", () => {
  it("splits when longitude jumps across the antimeridian", () => {
    const segments = splitTrackAtAntimeridian([
      [10, 170],
      [11, 175],
      [12, -175],
      [13, -170],
    ]);

    expect(segments).toEqual([
      [
        [10, 170],
        [11, 175],
      ],
      [
        [12, -175],
        [13, -170],
      ],
    ]);
  });
});

describe("buildGroundTrackSegments", () => {
  it("returns empty segments without TLE lines", () => {
    expect(buildGroundTrackSegments(undefined, new Date())).toEqual([]);
    expect(buildGroundTrackSegments({line1: "", line2: ""}, new Date())).toEqual([]);
  });

  it("builds drawable segments for a valid TLE", () => {
    const segments = buildGroundTrackSegments(sampleTle, new Date("2022-02-22T12:00:00.000Z"), 2);
    expect(segments.length).toBeGreaterThan(0);
    expect(segments.every((segment) => segment.length >= 2)).toBe(true);
  });
});
