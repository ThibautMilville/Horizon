import {recordEntries} from "@/shared/lib/record-entries";

export function configurationEntries(configuration: unknown): {key: string; value: string}[] {
  return recordEntries(configuration);
}

export function parseConfigurationText(
  text: string,
): {ok: true; value: Record<string, unknown>} | {ok: false; code: "object" | "json"} {
  const trimmed = text.trim();
  if (!trimmed) {
    return {ok: true, value: {}};
  }

  try {
    const parsed: unknown = JSON.parse(trimmed);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {ok: false, code: "object" as const};
    }

    return {ok: true, value: parsed as Record<string, unknown>};
  } catch {
    return {ok: false, code: "json" as const};
  }
}

export function configurationToText(configuration: unknown): string {
  if (!configuration || typeof configuration !== "object") {
    return "{\n}\n";
  }

  return `${JSON.stringify(configuration, null, 2)}\n`;
}
