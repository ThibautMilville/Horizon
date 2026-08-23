import {useEffect, useMemo, useRef, useState, type KeyboardEvent, type RefObject} from "react";
import {useNavigate} from "react-router-dom";

import {useGlobalSearch} from "@/features/search/useGlobalSearch";
import {useI18n} from "@/shared/preferences/PreferencesProvider";
import {searchItems, type SearchEntityKind, type SearchItem} from "@/shared/lib/entity-search";
import {CloseIcon, SearchIcon} from "@/shared/ui/actions/action-icons";
import {SearchResultsSkeleton} from "@/shared/ui/feedback/LoadingSkeletons";

import styles from "./GlobalSearch.module.scss";

const RESULT_LIST_ID = "global-search-results";

function entityLabelKey(kind: SearchEntityKind) {
  return `search.kind.${kind}` as const;
}

type GlobalSearchProps = {
  open: boolean;
  onClose: () => void;
  dismissBoundaryRef: RefObject<HTMLElement | null>;
  mapSatelliteIds: ReadonlySet<string>;
  mapStationIds: ReadonlySet<string>;
  onSelectSatellite: (id: string) => void;
  onSelectStation: (id: string) => void;
};

export function GlobalSearch({
  open,
  onClose,
  dismissBoundaryRef,
  mapSatelliteIds,
  mapStationIds,
  onSelectSatellite,
  onSelectStation,
}: GlobalSearchProps) {
  const {t} = useI18n();
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const {items, loading, errorMessage} = useGlobalSearch(open);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const results = useMemo(() => searchItems(items, query), [items, query]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    } else {
      setQuery("");
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape" && rootRef.current?.contains(document.activeElement)) {
        onClose();
        inputRef.current?.blur();
      }
    };
    const onPointerDown = (event: MouseEvent) => {
      if (dismissBoundaryRef.current?.contains(event.target as Node)) {
        return;
      }
      onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [dismissBoundaryRef, onClose, open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const select = (item: SearchItem) => {
    const id = item.key.split(":")[1] ?? "";
    if (item.kind === "satellite" && mapSatelliteIds.has(id)) {
      onSelectSatellite(id);
      onClose();
      setQuery("");
      return;
    }
    if (item.kind === "station" && mapStationIds.has(id)) {
      onSelectStation(id);
      onClose();
      setQuery("");
      return;
    }
    navigate(item.href);
    onClose();
    setQuery("");
  };

  const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (results.length === 0) {
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => (current - 1 + results.length) % results.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      select(results[activeIndex] ?? results[0]);
    }
  };

  if (!open) {
    return null;
  }

  const hasQuery = query.trim().length >= 2;

  return (
    <section aria-label={t("search.globalLabel")} className={styles.panel} ref={rootRef}>
      <div className={styles.field}>
        <SearchIcon className={styles.icon} />
        <input
          aria-activedescendant={
            results[activeIndex] ? `global-search-result-${activeIndex}` : undefined
          }
          aria-autocomplete="list"
          aria-controls={RESULT_LIST_ID}
          aria-expanded={true}
          aria-label={t("search.globalLabel")}
          className={styles.input}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={onInputKeyDown}
          placeholder={t("search.globalPlaceholder")}
          ref={inputRef}
          role="combobox"
          value={query}
        />
        {query ? (
          <button
            aria-label={t("common.clearSearch")}
            className={styles.clear}
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            type="button"
          >
            <CloseIcon />
          </button>
        ) : (
          <kbd className={styles.shortcut}>Ctrl K</kbd>
        )}
      </div>

      <div className={styles.menu} id={RESULT_LIST_ID} role="listbox">
        {loading && !hasQuery ? <SearchResultsSkeleton /> : null}
        {errorMessage ? <p className={styles.error}>{t("search.loadFailed")}</p> : null}
        {!errorMessage && hasQuery && results.length === 0 && !loading ? (
          <p className={styles.message}>{t("search.noResults")}</p>
        ) : null}
        {!hasQuery && !loading ? <p className={styles.message}>{t("search.hint")}</p> : null}
        {results.map((item, index) => (
          <button
            aria-selected={activeIndex === index}
            className={`${styles.result} ${activeIndex === index ? styles.active : ""}`}
            id={`global-search-result-${index}`}
            key={item.key}
            onClick={() => select(item)}
            onMouseEnter={() => setActiveIndex(index)}
            role="option"
            type="button"
          >
            <span className={styles.copy}>
              <strong>{item.title}</strong>
              {item.description ? <small>{item.description}</small> : null}
            </span>
            <span className={`${styles.badge} ${styles[`badge-${item.kind}`]}`}>
              {t(entityLabelKey(item.kind))}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
