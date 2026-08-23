export type SearchEntityKind =
  | "satellite"
  | "station"
  | "payload"
  | "customer"
  | "contact"
  | "report";

export type SearchItem = {
  key: string;
  kind: SearchEntityKind;
  title: string;
  description?: string;
  href: string;
};

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase();
}

function searchScore(item: SearchItem, normalizedQuery: string): number {
  const title = normalize(item.title);
  const description = normalize(item.description ?? "");

  if (title === normalizedQuery) {
    return 0;
  }
  if (title.startsWith(normalizedQuery)) {
    return 1;
  }
  if (title.includes(normalizedQuery)) {
    return 2;
  }
  if (description.includes(normalizedQuery)) {
    return 3;
  }
  return Number.POSITIVE_INFINITY;
}

export function searchItems(items: SearchItem[], query: string, limit = 8): SearchItem[] {
  const normalizedQuery = normalize(query.trim());
  if (normalizedQuery.length < 2) {
    return [];
  }

  return items
    .map((item, index) => ({item, index, score: searchScore(item, normalizedQuery)}))
    .filter(({score}) => Number.isFinite(score))
    .sort((left, right) => left.score - right.score || left.index - right.index)
    .slice(0, limit)
    .map(({item}) => item);
}
