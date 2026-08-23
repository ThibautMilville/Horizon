import {describe, expect, it} from "vitest";

import {contactBucket, partitionContacts, payloadsForSatellite} from "./contact-schedule";

describe("contactBucket", () => {
  const now = new Date("2024-06-01T12:00:00.000Z");

  it("classifies past and upcoming contacts", () => {
    expect(contactBucket("2024-05-01T00:00:00.000Z", now)).toBe("past");
    expect(contactBucket("2024-06-01T12:00:00.000Z", now)).toBe("upcoming");
    expect(contactBucket("2024-07-01T00:00:00.000Z", now)).toBe("upcoming");
  });

  it("treats invalid dates as past", () => {
    expect(contactBucket("not-a-date", now)).toBe("past");
  });
});

describe("partitionContacts", () => {
  it("splits and sorts past descending and upcoming ascending", () => {
    const now = new Date("2024-06-01T00:00:00.000Z");
    const rows = [
      {id: "a", date: "2024-05-01T00:00:00.000Z"},
      {id: "b", date: "2024-07-01T00:00:00.000Z"},
      {id: "c", date: "2024-04-01T00:00:00.000Z"},
      {id: "d", date: "2024-08-01T00:00:00.000Z"},
    ];

    const {past, upcoming} = partitionContacts(rows, now);
    expect(past.map((row) => row.id)).toEqual(["a", "c"]);
    expect(upcoming.map((row) => row.id)).toEqual(["b", "d"]);
  });
});

describe("payloadsForSatellite", () => {
  it("keeps payloads for the selected satellite", () => {
    const payloads = [
      {id: "1", satellite_id: "s1"},
      {id: "2", satellite_id: "s2"},
      {id: "3", satellite_id: "s1"},
    ];
    expect(payloadsForSatellite(payloads, "s1").map((row) => row.id)).toEqual(["1", "3"]);
    expect(payloadsForSatellite(payloads, "")).toEqual([]);
  });
});
