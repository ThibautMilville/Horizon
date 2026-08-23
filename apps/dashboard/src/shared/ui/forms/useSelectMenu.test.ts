import {describe, expect, it} from "vitest";

import {filterSelectOptions, nextEnabledOptionIndex} from "./useSelectMenu";

describe("filterSelectOptions", () => {
  const options = [
    {value: "a", label: "Alpha"},
    {value: "b", label: "Bravo"},
    {value: "c", label: "Charlie"},
  ];

  it("returns all options when search is empty", () => {
    expect(filterSelectOptions(options, "")).toEqual(options);
    expect(filterSelectOptions(options, "   ")).toEqual(options);
  });

  it("filters by label case-insensitively", () => {
    expect(filterSelectOptions(options, "br")).toEqual([{value: "b", label: "Bravo"}]);
  });
});

describe("nextEnabledOptionIndex", () => {
  const options = [
    {value: "a", label: "Alpha", disabled: true},
    {value: "b", label: "Bravo"},
    {value: "c", label: "Charlie", disabled: true},
  ];

  it("skips disabled options in both directions", () => {
    expect(nextEnabledOptionIndex(options, null, 1)).toBe(1);
    expect(nextEnabledOptionIndex(options, 1, 1)).toBe(1);
    expect(nextEnabledOptionIndex(options, 1, -1)).toBe(1);
  });
});
