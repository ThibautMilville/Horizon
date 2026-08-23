export function normalizeMapLongitude(value: number): number {
  return ((((value + 180) % 360) + 360) % 360) - 180;
}

export function formatLatitude(value: number): string {
  const hemisphere = value >= 0 ? "N" : "S";
  return `${Math.abs(value).toFixed(4)}° ${hemisphere}`;
}

export function formatLongitude(value: number): string {
  const normalized = normalizeMapLongitude(value);
  const hemisphere = normalized >= 0 ? "E" : "W";
  return `${Math.abs(normalized).toFixed(4)}° ${hemisphere}`;
}

export function formatLatLng(latitude: number, longitude: number): string {
  return `${formatLatitude(latitude)} ${formatLongitude(longitude)}`;
}
