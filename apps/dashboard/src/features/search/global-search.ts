import type {SearchEntityKind, SearchItem} from "@/shared/lib/entity-search";

type NamedSearchEntity = {
  id: string;
  name: string;
  status?: string | null;
};

type GlobalSearchData = {
  allSatellites?: Array<(NamedSearchEntity & {manufacturer?: string | null}) | null> | null;
  allGroundStations?: Array<(NamedSearchEntity & {network?: string | null}) | null> | null;
  allPayloads?: Array<(NamedSearchEntity & {category?: string | null}) | null> | null;
  allCustomers?: Array<{id: string; name: string; email?: string | null} | null> | null;
  allContacts?: Array<{
    id: string;
    date: string;
    type: string;
    Satellite?: {name: string} | null;
    GroundStation?: {name: string} | null;
  } | null> | null;
  allReports?: Array<{id: string; title: string; type: string; date: string} | null> | null;
};

function compactDescription(values: Array<string | null | undefined>): string | undefined {
  const description = values.filter(Boolean).join(" · ");
  return description || undefined;
}

function searchItemsFromEntities<T extends {id: string}>(
  entities: Array<T | null> | null | undefined,
  kind: SearchEntityKind,
  buildItem: (entity: T) => Omit<SearchItem, "key" | "kind">,
): SearchItem[] {
  const items: SearchItem[] = [];
  for (const entity of entities ?? []) {
    if (!entity) {
      continue;
    }
    items.push({
      key: `${kind}:${entity.id}`,
      kind,
      ...buildItem(entity),
    });
  }
  return items;
}

export function buildGlobalSearchItems(data?: GlobalSearchData): SearchItem[] {
  if (!data) {
    return [];
  }

  return [
    ...searchItemsFromEntities(data.allSatellites, "satellite", (entity) => ({
      title: entity.name,
      description: compactDescription([entity.status, entity.manufacturer]),
      href: `/satellites/${entity.id}`,
    })),
    ...searchItemsFromEntities(data.allGroundStations, "station", (entity) => ({
      title: entity.name,
      description: compactDescription([entity.status, entity.network]),
      href: `/stations/${entity.id}`,
    })),
    ...searchItemsFromEntities(data.allPayloads, "payload", (entity) => ({
      title: entity.name,
      description: compactDescription([entity.status, entity.category]),
      href: `/payloads/${entity.id}`,
    })),
    ...searchItemsFromEntities(data.allCustomers, "customer", (entity) => ({
      title: entity.name,
      description: entity.email ?? undefined,
      href: `/customers/${entity.id}`,
    })),
    ...searchItemsFromEntities(data.allContacts, "contact", (entity) => ({
      title: `${entity.type} · ${entity.Satellite?.name ?? entity.GroundStation?.name ?? entity.id}`,
      description: compactDescription([
        entity.Satellite?.name,
        entity.GroundStation?.name,
        entity.date,
      ]),
      href: `/contacts/${entity.id}`,
    })),
    ...searchItemsFromEntities(data.allReports, "report", (entity) => ({
      title: entity.title,
      description: compactDescription([entity.type, entity.date]),
      href: `/reports/${entity.id}`,
    })),
  ];
}
