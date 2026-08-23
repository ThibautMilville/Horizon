import L from "leaflet";

import {WORLD_MAX_BOUNDS} from "./map-viewport";

export type MapBasemap = "imagery" | "streets";

const CARTO_ATTRIBUTION =
  '<a href="https://www.openstreetmap.org/copyright">OSM</a> · <a href="https://carto.com/attributions">CARTO</a>';

const ESRI_ATTRIBUTION = '<a href="https://www.esri.com/">Esri</a>';

export function createBasemapLayer(basemap: MapBasemap): L.TileLayer {
  if (basemap === "streets") {
    return L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: CARTO_ATTRIBUTION,
      subdomains: "abcd",
      maxZoom: 12,
      noWrap: true,
      bounds: WORLD_MAX_BOUNDS,
    });
  }

  return L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      attribution: ESRI_ATTRIBUTION,
      maxZoom: 12,
      noWrap: true,
      bounds: WORLD_MAX_BOUNDS,
    },
  );
}
