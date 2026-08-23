type RecordEntriesOptions = {
  formatKey?: (key: string) => string;
  formatValue?: (value: unknown) => string;
};

function defaultFormatValue(value: unknown): string {
  return typeof value === "string" ? value : JSON.stringify(value);
}

export function recordEntries(
  source: unknown,
  options?: RecordEntriesOptions,
): {key: string; value: string}[] {
  if (!source || typeof source !== "object" || Array.isArray(source)) {
    return [];
  }

  const formatKey = options?.formatKey ?? ((key: string) => key);
  const formatValue = options?.formatValue ?? defaultFormatValue;

  return Object.entries(source as Record<string, unknown>).map(([key, value]) => ({
    key: formatKey(key),
    value: formatValue(value),
  }));
}
