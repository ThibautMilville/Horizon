import {describe, expect, it, vi} from "vitest";

import {
  formatShortcutLabel,
  handleMapShortcut,
  isEditableShortcutTarget,
  MAP_SHORTCUTS,
  tooltipWithShortcut,
  type MapShortcutActions,
} from "./map-shortcuts";

function createActions(overrides: Partial<MapShortcutActions> = {}): MapShortcutActions {
  return {
    toggleGlobalSearch: vi.fn(),
    zoomIn: vi.fn(),
    zoomOut: vi.fn(),
    fitView: vi.fn(),
    toggleStatusBar: vi.fn(),
    toggleSatellites: vi.fn(),
    toggleStations: vi.fn(),
    toggleTrack: vi.fn(),
    toggleTerminator: vi.fn(),
    cycleBasemap: vi.fn(),
    toggleFocusAndTrack: vi.fn(),
    toggleContactPlanner: vi.fn(),
    worldOverview: vi.fn(),
    canFocusAndTrack: true,
    tracking: false,
    ...overrides,
  };
}

function modKeyEvent(key: string, target?: EventTarget): KeyboardEvent {
  return {
    key,
    defaultPrevented: false,
    metaKey: false,
    ctrlKey: true,
    altKey: false,
    target: target ?? document.body,
    preventDefault: vi.fn(),
  } as unknown as KeyboardEvent;
}

describe("map shortcuts", () => {
  it("formats tooltip labels with ctrl-based shortcut hints", () => {
    expect(tooltipWithShortcut("Zoom in", MAP_SHORTCUTS.zoomIn)).toMatch(/Ctrl \+|Cmd \+/);
    expect(formatShortcutLabel(MAP_SHORTCUTS.search)).toMatch(/Ctrl K|Cmd K/);
    expect(formatShortcutLabel(MAP_SHORTCUTS.fitFleet)).toMatch(/Ctrl F|Cmd F/);
  });

  it("ignores shortcuts while typing in editable fields", () => {
    const input = document.createElement("input");
    expect(isEditableShortcutTarget(input)).toBe(true);

    const actions = createActions();
    expect(handleMapShortcut(modKeyEvent("f", input), actions)).toBe(false);
    expect(actions.fitView).not.toHaveBeenCalled();
  });

  it("maps ctrl combinations to actions", () => {
    const actions = createActions();
    expect(handleMapShortcut(modKeyEvent("="), actions)).toBe(true);
    expect(actions.zoomIn).toHaveBeenCalledOnce();

    expect(handleMapShortcut(modKeyEvent("s"), actions)).toBe(true);
    expect(actions.toggleSatellites).toHaveBeenCalledOnce();

    expect(handleMapShortcut(modKeyEvent("l"), actions)).toBe(true);
    expect(actions.toggleFocusAndTrack).toHaveBeenCalledOnce();
  });

  it("ignores shortcuts without the modifier", () => {
    const actions = createActions();
    const event = {
      key: "f",
      defaultPrevented: false,
      metaKey: false,
      ctrlKey: false,
      altKey: false,
      target: document.body,
      preventDefault: vi.fn(),
    } as unknown as KeyboardEvent;

    expect(handleMapShortcut(event, actions)).toBe(false);
    expect(actions.fitView).not.toHaveBeenCalled();
  });

  it("skips focus track when unavailable", () => {
    const actions = createActions({canFocusAndTrack: false, tracking: false});
    expect(handleMapShortcut(modKeyEvent("l"), actions)).toBe(false);
    expect(actions.toggleFocusAndTrack).not.toHaveBeenCalled();
  });
});
