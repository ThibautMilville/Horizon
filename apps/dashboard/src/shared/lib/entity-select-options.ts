import type {SelectOption} from "@/shared/ui/forms/Select";
import type {NamedEntity} from "@/shared/types/entities";

export function entitySelectOptions(
  entities: readonly NamedEntity[],
  leadingOptions: SelectOption[] = [],
): SelectOption[] {
  return [...leadingOptions, ...entities.map((entity) => ({value: entity.id, label: entity.name}))];
}
