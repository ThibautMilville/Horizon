export type TleLines = {
  line1: string;
  line2: string;
};

export function tleLines(tle: unknown): TleLines | undefined {
  if (!tle || typeof tle !== "object") {
    return undefined;
  }

  const record = tle as {line1?: unknown; line2?: unknown};
  if (typeof record.line1 !== "string" || typeof record.line2 !== "string") {
    return undefined;
  }

  return {line1: record.line1, line2: record.line2};
}
