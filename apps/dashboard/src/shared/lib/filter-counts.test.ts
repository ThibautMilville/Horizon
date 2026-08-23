import {describe, expect, it} from "vitest";

import {countByFilterValue, filterByField} from "./filter-counts";

describe("countByFilterValue", () => {
  it("counts all and each discrete value", () => {
    const rows = [{status: "In Orbit"}, {status: "In Orbit"}, {status: "Planned"}, {status: null}];

    expect(
      countByFilterValue(rows, ["", "In Orbit", "Planned", "Decommissioned"], (row) => row.status),
    ).toEqual({
      "": 4,
      "In Orbit": 2,
      Planned: 1,
      Decommissioned: 0,
    });
  });
});

describe("filterByField", () => {
  const rows = [
    {id: "1", status: "In Orbit"},
    {id: "2", status: "Planned"},
  ];

  it("returns all rows when the filter is empty", () => {
    expect(filterByField(rows, "", (row) => row.status)).toEqual(rows);
  });

  it("keeps matching values", () => {
    expect(filterByField(rows, "Planned", (row) => row.status)).toEqual([rows[1]]);
  });
});
