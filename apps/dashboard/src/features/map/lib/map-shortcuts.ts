export const MAP_SHORTCUTS = {
  search: "mod+k",
  zoomIn: "mod++",
  zoomOut: "mod+-",
  fitFleet: "mod+f",
  infoBar: "mod+i",
  satellites: "mod+s",
  stations: "mod+g",
  groundTrack: "mod+t",
  dayNight: "mod+d",
  basemap: "mod+b",
  focusTrack: "mod+l",
  contactPlanner: "mod+c",
  worldOverview: "mod+w",
} as const;

function isMacPlatform(): boolean {
  return typeof navigator !== "undefined" && /mac/i.test(navigator.platform);
}

export function formatShortcutLabel(shortcut: string): string {
  if (!shortcut.startsWith("mod+")) {
    return shortcut;
  }

  const key = shortcut.slice(4);
  const mod = isMacPlatform() ? "Cmd" : "Ctrl";

  if (key === "+" || key === "=") {
    return `${mod} +`;
  }

  if (key === "-") {
    return `${mod} -`;
  }

  return `${mod} ${key.toUpperCase()}`;
}

export function tooltipWithShortcut(label: string, shortcut: string): string {
  return `${label} (${formatShortcutLabel(shortcut)})`;
}

export function isEditableShortcutTarget(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) {
    return false;
  }

  const editable = target.closest("input, textarea, select, [contenteditable='true']");
  return Boolean(editable);
}

export type MapShortcutActions = {
  toggleGlobalSearch: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  fitView: () => void;
  toggleStatusBar: () => void;
  toggleSatellites: () => void;
  toggleStations: () => void;
  toggleTrack: () => void;
  toggleTerminator: () => void;
  cycleBasemap: () => void;
  toggleFocusAndTrack: () => void;
  toggleContactPlanner: () => void;
  worldOverview: () => void;
  canFocusAndTrack: boolean;
  tracking: boolean;
};

export function handleMapShortcut(event: KeyboardEvent, actions: MapShortcutActions): boolean {
  if (event.defaultPrevented || isEditableShortcutTarget(event.target)) {
    return false;
  }

  if (!event.metaKey && !event.ctrlKey) {
    return false;
  }

  const lowerKey = event.key.toLocaleLowerCase();

  switch (lowerKey) {
    case "k":
      event.preventDefault();
      actions.toggleGlobalSearch();
      return true;
    case "=":
    case "+":
      event.preventDefault();
      actions.zoomIn();
      return true;
    case "-":
    case "_":
      event.preventDefault();
      actions.zoomOut();
      return true;
    case "f":
      event.preventDefault();
      actions.fitView();
      return true;
    case "i":
      event.preventDefault();
      actions.toggleStatusBar();
      return true;
    case "s":
      event.preventDefault();
      actions.toggleSatellites();
      return true;
    case "g":
      event.preventDefault();
      actions.toggleStations();
      return true;
    case "t":
      event.preventDefault();
      actions.toggleTrack();
      return true;
    case "d":
      event.preventDefault();
      actions.toggleTerminator();
      return true;
    case "b":
      event.preventDefault();
      actions.cycleBasemap();
      return true;
    case "l":
      if (!actions.canFocusAndTrack && !actions.tracking) {
        return false;
      }
      event.preventDefault();
      actions.toggleFocusAndTrack();
      return true;
    case "c":
      event.preventDefault();
      actions.toggleContactPlanner();
      return true;
    case "w":
      event.preventDefault();
      actions.worldOverview();
      return true;
    default:
      return false;
  }
}
