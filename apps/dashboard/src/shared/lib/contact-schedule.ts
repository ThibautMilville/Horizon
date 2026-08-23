import {sortByDate} from "@/shared/lib/sort-by-date";

export const CONTACT_TYPES = ["Customer Task", "Maintenance"] as const;

export type ContactBucket = "past" | "upcoming";

export type ContactScheduleRow = {
  id: string;
  date: string;
};

export function contactBucket(date: string, now: Date): ContactBucket {
  const time = new Date(date).getTime();
  if (Number.isNaN(time)) {
    return "past";
  }

  return time >= now.getTime() ? "upcoming" : "past";
}

export function sortContactsByDate<T extends ContactScheduleRow>(
  rows: T[],
  bucket: ContactBucket,
): T[] {
  return sortByDate(rows, bucket === "upcoming" ? "asc" : "desc");
}

export function partitionContacts<T extends ContactScheduleRow>(
  rows: T[],
  now: Date,
): {past: T[]; upcoming: T[]} {
  const past: T[] = [];
  const upcoming: T[] = [];

  for (const row of rows) {
    if (contactBucket(row.date, now) === "upcoming") {
      upcoming.push(row);
    } else {
      past.push(row);
    }
  }

  return {
    past: sortContactsByDate(past, "past"),
    upcoming: sortContactsByDate(upcoming, "upcoming"),
  };
}

export function payloadsForSatellite<T extends {satellite_id?: string | null}>(
  payloads: T[],
  satelliteId: string,
): T[] {
  if (!satelliteId) {
    return [];
  }

  return payloads.filter((payload) => payload.satellite_id === satelliteId);
}
