export function compact<T>(items?: Array<T | null> | null): T[] {
  return (items ?? []).filter((item): item is T => item != null);
}
