export const SATELLITE_TRACK_POLL_MS = 2000;
export const SATELLITE_FOLLOW_ZOOM = 3;

export function isTrackingSatellite(
  trackingSatelliteId: string,
  selectedSatelliteId: string,
): boolean {
  return Boolean(trackingSatelliteId) && trackingSatelliteId === selectedSatelliteId;
}

export function trackingStatusHint(input: {
  tracking: boolean;
  selectedSatelliteName?: string;
  fallback: string;
  trackingNamed?: string;
}): string {
  if (input.tracking && input.selectedSatelliteName) {
    return input.trackingNamed ?? `Tracking · ${input.selectedSatelliteName}`;
  }

  return input.fallback;
}
