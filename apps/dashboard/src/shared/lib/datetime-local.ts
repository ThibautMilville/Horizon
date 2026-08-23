import type {HorizonLanguage} from "@/shared/preferences/preferences";

const LOCALES: Record<HorizonLanguage, string> = {
  en: "en-GB",
  fr: "fr-FR",
};

export function toDateTimeLocalValue(value?: string | null): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 16);
}

export function fromDateTimeLocalValue(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  let isoCandidate: string;
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(trimmed)) {
    isoCandidate = `${trimmed}:00.000Z`;
  } else if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(trimmed)) {
    isoCandidate = `${trimmed}.000Z`;
  } else if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(trimmed)) {
    isoCandidate = trimmed;
  } else {
    return null;
  }

  const date = new Date(isoCandidate);
  if (Number.isNaN(date.getTime()) || date.toISOString() !== isoCandidate) {
    return null;
  }

  return date.toISOString();
}

export function utcTodayDateOnly(now: Date = new Date()): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

function parsedDate(value?: string | null): Date | null {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatUtcDate(value?: string | null, language: HorizonLanguage = "en"): string {
  const date = parsedDate(value);
  return date ? date.toLocaleDateString(LOCALES[language], {timeZone: "UTC"}) : "-";
}

export function formatUtcDateTime(value?: string | null, language: HorizonLanguage = "en"): string {
  const date = parsedDate(value);
  return date
    ? date.toLocaleString(LOCALES[language], {
        timeZone: "UTC",
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "-";
}

export function formatUtcClock(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())} UTC`;
}
