import {describe, expect, it} from "vitest";

import {sortByDate} from "./sort-by-date";

describe("sortByDate", () => {
  const rows = [
    {id: "a", date: "2026-01-01T00:00:00.000Z"},
    {id: "b", date: "2026-03-01T00:00:00.000Z"},
    {id: "c", date: "2026-02-01T00:00:00.000Z"},
  ];

  it("sorts ascending for comments and contacts", () => {
    expect(sortByDate(rows, "asc").map((row) => row.id)).toEqual(["a", "c", "b"]);
  });

  it("sorts descending for reports", () => {
    expect(sortByDate(rows, "desc").map((row) => row.id)).toEqual(["b", "c", "a"]);
  });
});
