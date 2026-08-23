import {describe, expect, it} from "vitest";

import {
  formatUtcClock,
  formatUtcDate,
  formatUtcDateTime,
  fromDateTimeLocalValue,
  toDateTimeLocalValue,
  utcTodayDateOnly,
} from "./datetime-local";

describe("toDateTimeLocalValue", () => {
  it("formats instants as UTC datetime-local strings", () => {
    expect(toDateTimeLocalValue("2026-08-21T14:30:00.000Z")).toBe("2026-08-21T14:30");
    expect(toDateTimeLocalValue(null)).toBe("");
  });
});

describe("fromDateTimeLocalValue", () => {
  it("parses datetime-local values as UTC", () => {
    expect(fromDateTimeLocalValue("2026-08-21T14:30")).toBe("2026-08-21T14:30:00.000Z");
  });

  it("parses datetime-local values that include seconds", () => {
    expect(fromDateTimeLocalValue("2026-08-21T14:30:45")).toBe("2026-08-21T14:30:45.000Z");
  });

  it("returns null for empty, date-only, and invalid inputs", () => {
    expect(fromDateTimeLocalValue("")).toBeNull();
    expect(fromDateTimeLocalValue("   ")).toBeNull();
    expect(fromDateTimeLocalValue("2026-08-21")).toBeNull();
    expect(fromDateTimeLocalValue("not-a-date")).toBeNull();
    expect(fromDateTimeLocalValue("2026-13-40T99:99")).toBeNull();
  });

  it("rejects calendar dates normalized by JavaScript", () => {
    expect(fromDateTimeLocalValue("2026-02-29T10:15")).toBeNull();
    expect(fromDateTimeLocalValue("2026-02-30T10:15:30")).toBeNull();
    expect(fromDateTimeLocalValue("2026-04-31T10:15:30.000Z")).toBeNull();
    expect(fromDateTimeLocalValue("2024-02-29T10:15")).toBe("2024-02-29T10:15:00.000Z");
  });
});

describe("utcTodayDateOnly", () => {
  it("uses the UTC calendar day not the local day", () => {
    const nearUtcMidnight = new Date("2026-08-21T00:30:00+14:00");
    const today = utcTodayDateOnly(nearUtcMidnight);
    expect(today.toISOString()).toBe("2026-08-20T00:00:00.000Z");
  });

  it("stays on the UTC day late in that day", () => {
    const lateUtc = new Date("2026-08-21T23:45:00-10:00");
    const today = utcTodayDateOnly(lateUtc);
    expect(today.toISOString()).toBe("2026-08-22T00:00:00.000Z");
  });
});

describe("formatUtcClock", () => {
  it("formats a UTC timestamp with seconds", () => {
    expect(formatUtcClock(new Date(Date.UTC(2024, 10, 13, 1, 43, 9)))).toBe(
      "2024-11-13 01:43:09 UTC",
    );
  });
});

describe("localized UTC date formatting", () => {
  it("formats dates with the selected locale", () => {
    expect(formatUtcDate("2021-01-09T00:00:00.000Z", "en")).toBe("09/01/2021");
    expect(formatUtcDate("2021-01-09T00:00:00.000Z", "fr")).toBe("09/01/2021");
    expect(formatUtcDateTime("2024-01-20T12:30:00.000Z", "fr")).toMatch(/20 janv\. 2024/);
  });

  it("returns a placeholder for missing or invalid input", () => {
    expect(formatUtcDate(undefined)).toBe("-");
    expect(formatUtcDateTime("invalid")).toBe("-");
  });
});
