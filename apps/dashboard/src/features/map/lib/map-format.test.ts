import {describe, expect, it} from "vitest";

import {formatLatitude, formatLatLng, formatLongitude, normalizeMapLongitude} from "./map-format";

describe("map-format", () => {
  it("formats latitude and longitude with hemispheres", () => {
    expect(formatLatitude(34.4779)).toBe("34.4779° N");
    expect(formatLatitude(-12.246)).toBe("12.2460° S");
    expect(formatLongitude(132.9642)).toBe("132.9642° E");
    expect(formatLongitude(-45.5)).toBe("45.5000° W");
  });

  it("joins a coordinate pair", () => {
    expect(formatLatLng(0, 0)).toBe("0.0000° N 0.0000° E");
  });

  it("normalizes longitudes across the antimeridian", () => {
    expect(normalizeMapLongitude(-180)).toBe(-180);
    expect(normalizeMapLongitude(180)).toBe(-180);
    expect(normalizeMapLongitude(540)).toBe(-180);
    expect(normalizeMapLongitude(-181)).toBe(179);
  });
});
