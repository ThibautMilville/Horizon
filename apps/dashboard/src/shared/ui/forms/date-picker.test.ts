import {describe, expect, it} from "vitest";

import {chooseAnchoredMenuCoords} from "./anchored-menu";
import {
  buildMonthCells,
  buildYearOptions,
  composeDateTimeValue,
  formatDatePickerDisplay,
  isDateOutOfRange,
  shiftCalendarCursor,
  splitDateTimeValue,
  toDateOnly,
  toIsoDate,
  yearDecadeStart,
} from "./date-picker";

describe("splitDateTimeValue", () => {
  it("splits date and time parts", () => {
    expect(splitDateTimeValue("2026-08-20T14:30", true)).toEqual({
      datePart: "2026-08-20",
      timePart: "14:30",
    });
    expect(splitDateTimeValue("", true)).toEqual({datePart: "", timePart: "09:00"});
  });
});

describe("formatDatePickerDisplay", () => {
  it("formats English dates with the en-GB locale", () => {
    expect(formatDatePickerDisplay("2026-08-20", false, "en")).toBe("20 Aug 2026");
    expect(formatDatePickerDisplay("2026-08-20T09:15", true, "en")).toBe("20 Aug 2026 · 09:15");
  });

  it("formats French dates with the fr-FR locale", () => {
    expect(formatDatePickerDisplay("2026-08-20", false, "fr")).toBe("20 août 2026");
  });
});

describe("UTC date conversion", () => {
  it("parses date-only values at UTC midnight", () => {
    expect(toDateOnly("2026-08-20")?.toISOString()).toBe("2026-08-20T00:00:00.000Z");
    expect(toDateOnly("2026-02-31")).toBeNull();
  });

  it("serializes the UTC calendar day across timezone offsets", () => {
    expect(toIsoDate(new Date("2026-08-20T23:30:00-10:00"))).toBe("2026-08-21");
  });
});

describe("buildMonthCells", () => {
  it("pads a Monday-first month grid", () => {
    const cells = buildMonthCells(new Date(Date.UTC(2026, 7, 1)));
    expect(cells.length % 7).toBe(0);
    expect(cells.some((cell) => cell.date && toIsoDate(cell.date) === "2026-08-01")).toBe(true);
  });
});

describe("isDateOutOfRange", () => {
  it("respects min and max bounds", () => {
    const day = new Date(Date.UTC(2026, 7, 20));
    expect(isDateOutOfRange(day, new Date(Date.UTC(2026, 7, 21)), null)).toBe(true);
    expect(isDateOutOfRange(day, null, new Date(Date.UTC(2026, 7, 19)))).toBe(true);
    expect(
      isDateOutOfRange(day, new Date(Date.UTC(2026, 7, 1)), new Date(Date.UTC(2026, 7, 31))),
    ).toBe(false);
  });
});

describe("composeDateTimeValue", () => {
  it("builds date-only or datetime values", () => {
    expect(composeDateTimeValue("2026-08-20", false, "10:00")).toBe("2026-08-20");
    expect(composeDateTimeValue("2026-08-20", true, "10:00")).toBe("2026-08-20T10:00");
  });
});

describe("calendar navigation helpers", () => {
  it("shifts month year and decade cursors", () => {
    const base = new Date(Date.UTC(2026, 7, 1));
    expect(shiftCalendarCursor(base, "day", 1).getUTCMonth()).toBe(8);
    expect(shiftCalendarCursor(base, "month", 1).getUTCFullYear()).toBe(2027);
    expect(shiftCalendarCursor(base, "year", 1).getUTCFullYear()).toBe(2038);
  });

  it("builds a twelve-year decade window", () => {
    expect(yearDecadeStart(2026)).toBe(2016);
    expect(buildYearOptions(2026)).toEqual([
      2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027,
    ]);
  });
});

describe("chooseAnchoredMenuCoords", () => {
  it("opens downward when there is room below", () => {
    const coords = chooseAnchoredMenuCoords({
      trigger: {top: 40, right: 300, bottom: 72, left: 40, width: 240},
      viewportWidth: 1200,
      viewportHeight: 800,
    });
    expect(coords.openUpward).toBe(false);
    expect(coords.compact).toBe(false);
    expect(coords.top).toBeGreaterThan(72);
    expect(coords.maxHeight).toBeGreaterThan(140);
  });

  it("opens upward near the bottom edge with viewport margin", () => {
    const coords = chooseAnchoredMenuCoords({
      trigger: {top: 720, right: 300, bottom: 752, left: 40, width: 240},
      viewportWidth: 1200,
      viewportHeight: 800,
    });
    expect(coords.openUpward).toBe(true);
    expect(coords.bottom).toBeGreaterThan(0);
    expect(coords.maxHeight).toBeLessThanOrEqual(720 - 8);
  });

  it("uses a full-width compact panel on narrow viewports", () => {
    const coords = chooseAnchoredMenuCoords({
      trigger: {top: 80, right: 280, bottom: 112, left: 16, width: 260},
      viewportWidth: 390,
      viewportHeight: 780,
      minWidth: 280,
    });
    expect(coords.compact).toBe(true);
    expect(coords.left).toBe(8);
    expect(coords.width).toBe(374);
  });
});
