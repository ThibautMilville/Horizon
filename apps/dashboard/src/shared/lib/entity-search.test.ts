import {describe, expect, it} from "vitest";

import {searchItems, type SearchItem} from "./entity-search";

const items: SearchItem[] = [
  {
    key: "station:1",
    kind: "station",
    title: "Toulouse Ground Station",
    description: "Operational",
    href: "/stations/1",
  },
  {
    key: "satellite:1",
    kind: "satellite",
    title: "Toulouse Explorer",
    description: "Orbiting",
    href: "/satellites/1",
  },
  {
    key: "customer:1",
    kind: "customer",
    title: "Étoile Labs",
    description: "ops@example.com",
    href: "/customers/1",
  },
];

describe("searchItems", () => {
  it("requires two characters and ignores case and accents", () => {
    expect(searchItems(items, "t")).toEqual([]);
    expect(searchItems(items, "etoile")).toEqual([items[2]]);
  });

  it("ranks title matches before descriptions while preserving source order", () => {
    expect(searchItems(items, "toulouse")).toEqual([items[0], items[1]]);
    expect(searchItems(items, "orbiting")).toEqual([items[1]]);
  });

  it("honors the result limit", () => {
    expect(searchItems(items, "toulouse", 1)).toEqual([items[0]]);
  });
});
