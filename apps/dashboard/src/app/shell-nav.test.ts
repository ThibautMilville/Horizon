import {describe, expect, it} from "vitest";

import {isImmersiveShell} from "./shell-nav";

describe("isImmersiveShell", () => {
  it("is true only for the map workspace", () => {
    expect(isImmersiveShell("/")).toBe(true);
    expect(isImmersiveShell("/map")).toBe(true);
    expect(isImmersiveShell("/map/")).toBe(true);
    expect(isImmersiveShell("/fleet")).toBe(false);
    expect(isImmersiveShell("/satellites")).toBe(false);
  });
});
