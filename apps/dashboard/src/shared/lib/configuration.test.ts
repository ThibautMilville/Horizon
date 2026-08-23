import {describe, expect, it} from "vitest";

import {configurationEntries, configurationToText, parseConfigurationText} from "./configuration";

describe("configuration", () => {
  it("lists object entries as strings", () => {
    expect(configurationEntries({USER_ID: "123", SUDO: true})).toEqual([
      {key: "USER_ID", value: "123"},
      {key: "SUDO", value: "true"},
    ]);
  });

  it("parses object JSON and rejects arrays", () => {
    expect(parseConfigurationText('{"a":1}')).toEqual({ok: true, value: {a: 1}});
    expect(parseConfigurationText("[1]").ok).toBe(false);
    expect(parseConfigurationText("nope").ok).toBe(false);
  });

  it("pretty-prints configuration text", () => {
    expect(configurationToText({a: 1})).toContain('"a": 1');
  });
});
