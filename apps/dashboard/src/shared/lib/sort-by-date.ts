export function sortByDate<T extends {date: string}>(
  rows: readonly T[],
  direction: "asc" | "desc",
): T[] {
  const copy = [...rows];
  copy.sort((left, right) => {
    const delta = new Date(left.date).getTime() - new Date(right.date).getTime();
    return direction === "asc" ? delta : -delta;
  });
  return copy;
}
