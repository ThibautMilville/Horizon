import L from "leaflet";

import {createBasemapLayer, type MapBasemap} from "@/features/map/lib/map-basemap";
import type {LatLng} from "@/features/map/lib/ground-track";
import {createMapMarkerIcon, type MapThemeColors} from "@/features/map/lib/map-markers";
import type {FleetMapPoint} from "@/features/map/lib/map-points";
import {buildNightPolygon} from "@/features/map/lib/terminator";
import type {HorizonTheme} from "@/shared/preferences/preferences";

export function visibleFleetMapPoints(
  points: FleetMapPoint[],
  showSatellites: boolean,
  showStations: boolean,
): FleetMapPoint[] {
  return points.filter((point) => {
    if (point.kind === "satellite") {
      return showSatellites;
    }
    return showStations;
  });
}

export function replaceBasemapLayer(
  map: L.Map,
  basemap: MapBasemap,
  previous: L.TileLayer | null,
): L.TileLayer {
  const next = createBasemapLayer(basemap);
  next.addTo(map);
  next.bringToBack();
  if (previous) {
    map.removeLayer(previous);
  }
  return next;
}

export function replaceTerminatorLayer(
  map: L.Map,
  previous: L.Polygon | null,
  input: {
    showTerminator: boolean;
    at: Date;
    fillColor: string;
    theme: HorizonTheme;
  },
): L.Polygon | null {
  if (previous) {
    map.removeLayer(previous);
  }

  if (!input.showTerminator) {
    return null;
  }

  const polygon = L.polygon(buildNightPolygon(input.at), {
    stroke: false,
    fillColor: input.fillColor,
    fillOpacity: input.theme === "contrast" ? 0.55 : 0.42,
    interactive: false,
    bubblingMouseEvents: false,
    className: "horizon-map-terminator",
  });
  polygon.addTo(map);
  polygon.bringToBack();
  return polygon;
}

type SyncOverlayArgs = {
  points: FleetMapPoint[];
  showSatellites: boolean;
  showStations: boolean;
  showTrack: boolean;
  trackSegments: LatLng[][];
  selectedSatelliteId: string;
  selectedStationId: string;
  colors: MapThemeColors;
  theme: HorizonTheme;
  onSelectSatellite: (id: string) => void;
  onSelectStation: (id: string) => void;
};

export function syncFleetMapOverlay(layer: L.LayerGroup, args: SyncOverlayArgs): FleetMapPoint[] {
  layer.clearLayers();

  const visiblePoints = visibleFleetMapPoints(args.points, args.showSatellites, args.showStations);

  if (args.showTrack) {
    for (const segment of args.trackSegments) {
      L.polyline(segment, {
        color: args.colors.trackGlow,
        weight: 7,
        opacity: args.theme === "contrast" ? 0.55 : 0.35,
        lineCap: "round",
        lineJoin: "round",
        interactive: false,
      }).addTo(layer);

      L.polyline(segment, {
        color: args.colors.track,
        weight: 2.5,
        opacity: 0.95,
        lineCap: "round",
        lineJoin: "round",
        interactive: false,
      }).addTo(layer);
    }
  }

  for (const point of visiblePoints) {
    const selected =
      (point.kind === "satellite" && point.id === args.selectedSatelliteId) ||
      (point.kind === "station" && point.id === args.selectedStationId);
    const marker = L.marker([point.latitude, point.longitude], {
      icon: createMapMarkerIcon(point.kind, selected),
      zIndexOffset: selected ? 600 : point.kind === "satellite" ? 400 : 200,
      riseOnHover: true,
      title: point.name,
    });

    marker.on("click", () => {
      if (point.kind === "satellite") {
        args.onSelectSatellite(point.id);
      } else {
        args.onSelectStation(point.id);
      }
    });

    marker.addTo(layer);
  }

  return visiblePoints;
}
