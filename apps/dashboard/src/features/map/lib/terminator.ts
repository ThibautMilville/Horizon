import type {LatLng} from "./ground-track";

const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;

export function sunGeographicPosition(date: Date): {latitude: number; longitude: number} {
  const julianDay = toJulianDay(date);
  const gst = greenwichMeanSiderealTime(julianDay);
  const sun = sunEquatorialPosition(julianDay);
  const longitude = normalizeLongitude(sun.rightAscension - gst * 15);

  return {
    latitude: sun.declination,
    longitude,
  };
}

export function buildNightPolygon(date: Date, resolution = 2, longitudeRange = 720): LatLng[] {
  const julianDay = toJulianDay(date);
  const gst = greenwichMeanSiderealTime(julianDay);
  const sun = sunEquatorialPosition(julianDay);
  const halfRange = longitudeRange / 2;
  const nightPoleLat = sun.declination < 0 ? 90 : -90;
  const ring: LatLng[] = [[nightPoleLat, -halfRange]];

  const steps = Math.floor(longitudeRange * resolution);
  for (let index = 0; index <= steps; index += 1) {
    const longitude = -halfRange + index / resolution;
    const hourAngle = gst * 15 + longitude - sun.rightAscension;
    ring.push([terminatorLatitude(hourAngle, sun.declination), longitude]);
  }

  ring.push([nightPoleLat, halfRange]);
  return ring;
}

function toJulianDay(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

function greenwichMeanSiderealTime(julianDay: number): number {
  const days = julianDay - 2451545;
  return (18.697374558 + 24.06570982441908 * days) % 24;
}

function sunEquatorialPosition(julianDay: number): {rightAscension: number; declination: number} {
  const days = julianDay - 2451545;
  let meanLongitude = (280.46 + 0.9856474 * days) % 360;
  if (meanLongitude < 0) {
    meanLongitude += 360;
  }

  let meanAnomaly = (357.528 + 0.9856003 * days) % 360;
  if (meanAnomaly < 0) {
    meanAnomaly += 360;
  }

  const eclipticLongitude =
    meanLongitude + 1.915 * Math.sin(meanAnomaly * DEG) + 0.02 * Math.sin(2 * meanAnomaly * DEG);
  const centuries = days / 36525;
  const obliquity =
    23.43929111 -
    centuries *
      (46.836769 / 3600 -
        centuries *
          (0.0001831 / 3600 +
            centuries *
              (0.0020034 / 3600 - centuries * (0.576e-6 / 3600 - (centuries * 4.34e-8) / 3600))));

  let rightAscension =
    Math.atan(Math.cos(obliquity * DEG) * Math.tan(eclipticLongitude * DEG)) * RAD;
  const declination =
    Math.asin(Math.sin(obliquity * DEG) * Math.sin(eclipticLongitude * DEG)) * RAD;

  const longitudeQuadrant = Math.floor(eclipticLongitude / 90) * 90;
  const ascensionQuadrant = Math.floor(rightAscension / 90) * 90;
  rightAscension += longitudeQuadrant - ascensionQuadrant;

  return {rightAscension, declination};
}

function terminatorLatitude(hourAngleDegrees: number, declinationDegrees: number): number {
  const declination =
    Math.abs(declinationDegrees) < 0.0001
      ? Math.sign(declinationDegrees || 1) * 0.0001
      : declinationDegrees;
  const latitude = Math.atan(-Math.cos(hourAngleDegrees * DEG) / Math.tan(declination * DEG)) * RAD;
  return Math.max(-90, Math.min(90, latitude));
}

function normalizeLongitude(value: number): number {
  return ((((value + 180) % 360) + 360) % 360) - 180;
}
