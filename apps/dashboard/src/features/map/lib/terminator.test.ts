import {describe, expect, it} from "vitest";

import {buildNightPolygon, sunGeographicPosition} from "./terminator";

describe("terminator", () => {
  it("places the sun near Greenwich around March equinox noon UTC", () => {
    const sun = sunGeographicPosition(new Date(Date.UTC(2024, 2, 20, 12, 0, 0)));
    expect(Math.abs(sun.latitude)).toBeLessThan(3);
    expect(Math.abs(sun.longitude)).toBeLessThan(15);
  });

  it("keeps France in daylight mid-afternoon CEST in August", () => {
    const date = new Date(Date.UTC(2026, 7, 20, 13, 0, 0));
    const sun = sunGeographicPosition(date);
    const night = buildNightPolygon(date, 2, 360);
    expect(angularDistanceDegrees(48.85, 2.35, sun.latitude, sun.longitude)).toBeLessThan(90);
    expect(pointInPolygon(48.85, 2.35, night)).toBe(false);
  });

  it("builds a wide night polygon that covers the night hemisphere", () => {
    const date = new Date(Date.UTC(2026, 7, 20, 13, 0, 0));
    const sun = sunGeographicPosition(date);
    const polygon = buildNightPolygon(date, 2, 720);

    expect(polygon.length).toBeGreaterThan(700);
    expect(polygon[0]?.[0]).toBe(-90);
    expect(polygon[polygon.length - 1]?.[0]).toBe(-90);
    expect(polygon[0]?.[1]).toBe(-360);
    expect(polygon[polygon.length - 1]?.[1]).toBe(360);

    const nightSampleLongitude = normalizeLongitude(sun.longitude + 180);
    expect(pointInPolygon(-20, nightSampleLongitude, polygon)).toBe(true);
  });
});

function angularDistanceDegrees(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const deg = Math.PI / 180;
  return (
    Math.acos(
      Math.min(
        1,
        Math.max(
          -1,
          Math.sin(lat1 * deg) * Math.sin(lat2 * deg) +
            Math.cos(lat1 * deg) * Math.cos(lat2 * deg) * Math.cos((lon1 - lon2) * deg),
        ),
      ),
    ) / deg
  );
}

function normalizeLongitude(value: number): number {
  return ((((value + 180) % 360) + 360) % 360) - 180;
}

function pointInPolygon(lat: number, lon: number, ring: [number, number][]): boolean {
  let inside = false;
  for (
    let index = 0, previous = ring.length - 1;
    index < ring.length;
    previous = index, index += 1
  ) {
    const current = ring[index];
    const last = ring[previous];
    if (!current || !last) {
      continue;
    }

    const [yi, xi] = current;
    const [yj, xj] = last;
    const intersects =
      yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi || Number.EPSILON) + xi;
    if (intersects) {
      inside = !inside;
    }
  }
  return inside;
}
