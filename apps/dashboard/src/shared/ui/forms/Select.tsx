import {createPortal} from "react-dom";

import {useI18n} from "@/shared/preferences/PreferencesProvider";

import type {SelectMenuOption} from "./useSelectMenu";
import {useSelectMenu} from "./useSelectMenu";

import styles from "./Select.module.scss";

export type SelectOption = SelectMenuOption;

export type SelectProps = {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  searchable?: boolean;
  required?: boolean;
  "aria-label"?: string;
  id?: string;
};

export function Select({
  value,
  options,
  onChange,
  placeholder,
  searchPlaceholder,
  disabled = false,
  searchable = false,
  required = false,
  "aria-label": ariaLabel,
  id,
}: SelectProps) {
  const {t} = useI18n();
  const resolvedPlaceholder = placeholder ?? t("common.selectPlaceholder");
  const resolvedSearchPlaceholder = searchPlaceholder ?? t("common.search");
  const menu = useSelectMenu({disabled, options, value, onChange});
  const selected = options.find((option) => option.value === value);

  return (
    <div className={styles.root} ref={menu.rootRef}>
      <button
        aria-controls={menu.listId}
        aria-expanded={menu.open}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        aria-required={required || undefined}
        className={`${styles.trigger} ${menu.open ? styles["trigger-open"] : ""}`}
        disabled={disabled}
        id={id}
        onClick={menu.toggle}
        onKeyDown={menu.onTriggerKeyDown}
        ref={menu.triggerRef}
        type="button"
      >
        <span className={`${styles.value} ${selected ? "" : styles.placeholder}`}>
          {selected ? (
            <span className={styles["value-inner"]}>
              {selected.leading ? (
                <span aria-hidden="true" className={styles.leading}>
                  {selected.leading}
                </span>
              ) : null}
              <span className={styles["value-text"]}>{selected.label}</span>
            </span>
          ) : (
            resolvedPlaceholder
          )}
        </span>
        <span aria-hidden="true" className={`${styles.chevron} ${menu.open ? styles.open : ""}`}>
          <svg fill="none" height="14" viewBox="0 0 16 16" width="14">
            <path
              d="M4 6.2 8 10l4-3.8"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.6"
            />
          </svg>
        </span>
      </button>
      {menu.open && menu.menuStyle
        ? createPortal(
            <div className={styles.menu} ref={menu.menuRef} style={menu.menuStyle}>
              {searchable ? (
                <div className={styles.search}>
                  <input
                    aria-activedescendant={
                      menu.activeIndex == null ? undefined : menu.getOptionId(menu.activeIndex)
                    }
                    aria-controls={menu.listId}
                    aria-label={resolvedSearchPlaceholder}
                    aria-expanded="true"
                    aria-haspopup="listbox"
                    aria-autocomplete="list"
                    className={styles["search-input"]}
                    onChange={(event) => menu.updateSearchTerm(event.target.value)}
                    onClick={(event) => event.stopPropagation()}
                    onKeyDown={menu.onSearchKeyDown}
                    placeholder={resolvedSearchPlaceholder}
                    ref={menu.searchInputRef}
                    role="combobox"
                    type="search"
                    value={menu.searchTerm}
                  />
                </div>
              ) : null}
              <ul className={styles.list} id={menu.listId} role="listbox">
                {menu.filteredOptions.length === 0 ? (
                  <li className={styles.empty} role="presentation">
                    {t("common.noOptions")}
                  </li>
                ) : (
                  menu.filteredOptions.map((option, index) => {
                    const selectedOption = option.value === value;
                    const active = index === menu.activeIndex;
                    return (
                      <li
                        aria-disabled={option.disabled || undefined}
                        aria-selected={selectedOption}
                        className={`${styles.option} ${selectedOption ? styles.selected : ""} ${active ? styles.active : ""} ${option.disabled ? styles.disabled : ""}`}
                        id={menu.getOptionId(index)}
                        key={option.value === "" ? `__empty-${index}` : option.value}
                        onMouseDown={(event) => {
                          event.preventDefault();
                          menu.selectValue(option.value);
                        }}
                        onMouseEnter={() => menu.setActiveIndex(index)}
                        role="option"
                      >
                        {option.leading ? (
                          <span aria-hidden="true" className={styles.leading}>
                            {option.leading}
                          </span>
                        ) : null}
                        <span className={styles["option-label"]}>{option.label}</span>
                      </li>
                    );
                  })
                )}
              </ul>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
