export type DatePickerCell = {
  key: string;
  date: Date | null;
};

export type DatePickerPanel = "day" | "month" | "year";

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

function utcDate(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month, day));
}

export function splitDateTimeValue(
  value: string,
  includeTime: boolean,
): {datePart: string; timePart: string} {
  if (!value) {
    return {datePart: "", timePart: includeTime ? "09:00" : ""};
  }

  if (value.includes("T")) {
    const [datePart, timeRaw = "09:00"] = value.split("T");
    return {datePart, timePart: timeRaw.slice(0, 5)};
  }

  return {datePart: value.slice(0, 10), timePart: includeTime ? "09:00" : ""};
}

export function toDateOnly(value: string): Date | null {
  if (!value) {
    return null;
  }

  const datePart = value.includes("T") ? value.split("T")[0] : value;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(datePart);
  if (!match) {
    return null;
  }

  const parsed = utcDate(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return toIsoDate(parsed) === datePart ? parsed : null;
}

export function toIsoDate(date: Date): string {
  return `${date.getUTCFullYear()}-${pad2(date.getUTCMonth() + 1)}-${pad2(date.getUTCDate())}`;
}

export type DatePickerLanguage = "en" | "fr";

function dateLocale(language: DatePickerLanguage): string {
  return language === "fr" ? "fr-FR" : "en-GB";
}

export function formatDatePickerDisplay(
  value: string,
  includeTime: boolean,
  language: DatePickerLanguage = "en",
): string {
  const {datePart, timePart} = splitDateTimeValue(value, includeTime);
  const date = toDateOnly(datePart);
  if (!date) {
    return "";
  }

  const dateLabel = date.toLocaleDateString(dateLocale(language), {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

  if (!includeTime) {
    return dateLabel;
  }

  return `${dateLabel} · ${timePart}`;
}

export function buildMonthCells(visibleMonth: Date): DatePickerCell[] {
  const year = visibleMonth.getUTCFullYear();
  const month = visibleMonth.getUTCMonth();
  const firstDay = utcDate(year, month, 1);
  const lastDay = utcDate(year, month + 1, 0);
  const leadingBlanks = (firstDay.getUTCDay() + 6) % 7;
  const totalDays = lastDay.getUTCDate();
  const cells: DatePickerCell[] = [];

  for (let index = 0; index < leadingBlanks; index += 1) {
    cells.push({key: `blank-start-${index}`, date: null});
  }

  for (let day = 1; day <= totalDays; day += 1) {
    cells.push({
      key: `day-${day}`,
      date: utcDate(year, month, day),
    });
  }

  while (cells.length % 7 !== 0) {
    cells.push({key: `blank-end-${cells.length}`, date: null});
  }

  return cells;
}

export function isDateOutOfRange(date: Date, minDate: Date | null, maxDate: Date | null): boolean {
  const dayStart = utcDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());

  if (minDate && dayStart < minDate) {
    return true;
  }

  if (maxDate && dayStart > maxDate) {
    return true;
  }

  return false;
}

export function composeDateTimeValue(
  nextDate: string,
  includeTime: boolean,
  nextTime: string,
): string {
  if (!nextDate) {
    return "";
  }

  if (!includeTime) {
    return nextDate;
  }

  return `${nextDate}T${nextTime || "09:00"}`;
}

export function shiftCalendarCursor(
  visibleMonth: Date,
  panel: DatePickerPanel,
  delta: number,
): Date {
  if (panel === "day") {
    return utcDate(visibleMonth.getUTCFullYear(), visibleMonth.getUTCMonth() + delta, 1);
  }

  if (panel === "month") {
    return utcDate(visibleMonth.getUTCFullYear() + delta, visibleMonth.getUTCMonth(), 1);
  }

  return utcDate(visibleMonth.getUTCFullYear() + delta * 12, visibleMonth.getUTCMonth(), 1);
}

export function yearDecadeStart(year: number): number {
  return Math.floor(year / 12) * 12;
}

export function buildYearOptions(year: number): number[] {
  const start = yearDecadeStart(year);
  return Array.from({length: 12}, (_, index) => start + index);
}

export function monthLabel(monthIndex: number, language: DatePickerLanguage = "en"): string {
  return utcDate(2020, monthIndex, 1).toLocaleDateString(dateLocale(language), {
    month: "short",
    timeZone: "UTC",
  });
}

export function monthLongLabel(monthIndex: number, language: DatePickerLanguage = "en"): string {
  return utcDate(2020, monthIndex, 1).toLocaleDateString(dateLocale(language), {
    month: "long",
    timeZone: "UTC",
  });
}

export function weekdayLabels(language: DatePickerLanguage = "en"): string[] {
  const locale = dateLocale(language);
  return Array.from({length: 7}, (_, index) =>
    utcDate(2020, 0, 6 + index).toLocaleDateString(locale, {
      weekday: "short",
      timeZone: "UTC",
    }),
  );
}

export function isSameDay(left: Date, right: Date): boolean {
  return toIsoDate(left) === toIsoDate(right);
}

export const DATE_PICKER_MONTHS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;
