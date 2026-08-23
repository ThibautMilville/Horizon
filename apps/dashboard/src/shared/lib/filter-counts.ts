export function countByFilterValue<T>(
  rows: T[],
  values: readonly string[],
  getValue: (row: T) => string | null | undefined,
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const value of values) {
    counts[value] = 0;
  }

  counts[""] = rows.length;

  for (const row of rows) {
    const value = getValue(row);
    if (!value) {
      continue;
    }

    if (Object.prototype.hasOwnProperty.call(counts, value)) {
      counts[value] += 1;
    }
  }

  return counts;
}

export function filterLabel(value: string, allLabel = "All"): string {
  return value === "" ? allLabel : value;
}

export function filterByField<T>(
  rows: T[],
  fieldValue: string,
  getValue: (row: T) => string | null | undefined,
): T[] {
  if (!fieldValue) {
    return rows;
  }

  return rows.filter((row) => getValue(row) === fieldValue);
}
