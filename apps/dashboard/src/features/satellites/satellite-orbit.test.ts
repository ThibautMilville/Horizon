import {describe, expect, it} from "vitest";

import {
  buildOrbitalAltitudeProfile,
  sampleOrbitalAltitudeProfile,
  summarizeOrbitalAltitude,
} from "./satellite-orbit";

const sampleTle = {
  line1: "1    29U 60002B   22053.73599453  .00000075  00000-0  41992-4 0  9997",
  line2: "2    29  48.3791 284.6069 0024160 344.1103  15.9048 14.74533417309456",
};

describe("satellite orbit altitude", () => {
  it("samples a full orbital period with varying altitude", () => {
    const samples = sampleOrbitalAltitudeProfile(sampleTle, new Date("2022-02-22T12:00:00.000Z"));
    const summary = summarizeOrbitalAltitude(samples);

    expect(samples.length).toBeGreaterThan(10);
    expect(summary).not.toBeNull();
    expect(summary?.maxKm).toBeGreaterThan(summary?.minKm ?? 0);
    expect(summary?.periodMinutes).toBeGreaterThan(60);
  });

  it("builds a profile from TLE lines", () => {
    const profile = buildOrbitalAltitudeProfile(sampleTle, new Date("2022-02-22T12:00:00.000Z"));

    expect(profile).not.toBeNull();
    expect(profile!.summary.maxKm).toBeGreaterThan(profile!.summary.minKm);
  });

  it("returns null for invalid TLE input", () => {
    expect(buildOrbitalAltitudeProfile(undefined)).toBeNull();
    expect(buildOrbitalAltitudeProfile({line1: "bad", line2: "data"})).toBeNull();
  });
});
