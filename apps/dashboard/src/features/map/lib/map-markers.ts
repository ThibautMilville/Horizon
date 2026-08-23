import L from "leaflet";

import type {HorizonTheme} from "@/shared/preferences/preferences";

export type MapThemeColors = {
  satellite: string;
  station: string;
  track: string;
  trackGlow: string;
  terminator: string;
};

const MAP_THEME_COLORS: Record<HorizonTheme, MapThemeColors> = {
  dark: {
    satellite: "#3d7eff",
    station: "#e85aad",
    track: "#7eb6ff",
    trackGlow: "#1b3f73",
    terminator: "#07101f",
  },
  light: {
    satellite: "#2f66e0",
    station: "#d13d8f",
    track: "#4f8fe0",
    trackGlow: "#1b3f73",
    terminator: "#07101f",
  },
  contrast: {
    satellite: "#ff6a00",
    station: "#ff8533",
    track: "#ff6a00",
    trackGlow: "#000000",
    terminator: "#000000",
  },
};

export function resolveMapTheme(
  theme: string | null | undefined = typeof document !== "undefined"
    ? document.documentElement.dataset.theme
    : undefined,
): HorizonTheme {
  if (theme === "light" || theme === "contrast" || theme === "dark") {
    return theme;
  }
  return "dark";
}

export function resolveMapThemeColors(
  theme: string | null | undefined = typeof document !== "undefined"
    ? document.documentElement.dataset.theme
    : undefined,
): MapThemeColors {
  return MAP_THEME_COLORS[resolveMapTheme(theme)];
}

export function buildMapMarkerIconHtml(kind: "satellite" | "station", selected: boolean): string {
  const selectedClass = selected ? " horizon-map-marker-selected" : "";
  const kindClass =
    kind === "satellite" ? "horizon-map-marker-satellite" : "horizon-map-marker-station";
  const glyph = kind === "satellite" ? satelliteGlyph() : stationGlyph();
  return (
    `<div class="horizon-map-marker ${kindClass}${selectedClass}" aria-hidden="true">` +
    `<span class="horizon-map-marker-glyph">${glyph}</span>` +
    `</div>`
  );
}

export function createMapMarkerIcon(kind: "satellite" | "station", selected: boolean): L.DivIcon {
  const size = selected ? 40 : 34;
  return L.divIcon({
    className: "horizon-map-marker-wrap",
    html: buildMapMarkerIconHtml(kind, selected),
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

function satelliteGlyph(): string {
  return (
    `<svg fill="none" height="16" viewBox="0 0 16 16" width="16">` +
    `<rect height="4.2" rx="0.9" stroke="currentColor" stroke-width="1.4" transform="rotate(45 8 8)" width="4.2" x="5.9" y="5.9" />` +
    `<path d="M3.2 3.2 6.1 6.1M9.9 9.9l2.9 2.9M3.2 12.8 6.1 9.9M9.9 6.1l2.9-2.9" stroke="currentColor" stroke-linecap="round" stroke-width="1.4" />` +
    `</svg>`
  );
}

function stationGlyph(): string {
  return (
    `<svg fill="none" height="16" viewBox="0 0 16 16" width="16">` +
    `<path d="M8 13.2V8.2" stroke="currentColor" stroke-linecap="round" stroke-width="1.5" />` +
    `<path d="M4.1 8.4a3.9 3.9 0 0 1 7.8 0" stroke="currentColor" stroke-linecap="round" stroke-width="1.4" />` +
    `<path d="M2.4 6.7a5.6 5.6 0 0 1 11.2 0" stroke="currentColor" stroke-linecap="round" stroke-width="1.4" />` +
    `<circle cx="8" cy="8.2" fill="currentColor" r="1.15" />` +
    `</svg>`
  );
}
