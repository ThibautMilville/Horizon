import {describe, expect, it} from "vitest";

import {readSidebarCollapsed, writeSidebarCollapsed} from "./useSidebarCollapsed";

describe("sidebar collapse state", () => {
  it("persists collapsed state", () => {
    expect(readSidebarCollapsed()).toBe(false);
    writeSidebarCollapsed(true);
    expect(readSidebarCollapsed()).toBe(true);
    writeSidebarCollapsed(false);
    expect(readSidebarCollapsed()).toBe(false);
  });
});
