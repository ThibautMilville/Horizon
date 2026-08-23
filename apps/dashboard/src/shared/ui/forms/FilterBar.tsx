import {useCallback, useLayoutEffect, useRef, useState} from "react";

import {useI18n} from "@/shared/preferences/PreferencesProvider";

import styles from "./FilterBar.module.scss";

export type FilterBarOption = {
  value: string;
  label: string;
  count?: number;
};

type FilterBarProps = {
  options: FilterBarOption[];
  value: string;
  onChange: (value: string) => void;
  flush?: boolean;
  "aria-label"?: string;
};

export function FilterBar({
  options,
  value,
  onChange,
  flush = false,
  "aria-label": ariaLabel,
}: FilterBarProps) {
  const {t} = useI18n();
  const resolvedAriaLabel = ariaLabel ?? t("common.filter");
  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef(new Map<string, HTMLButtonElement>());
  const [indicator, setIndicator] = useState<{left: number; width: number} | null>(null);

  const updateIndicator = useCallback(() => {
    const container = containerRef.current;
    const activeEl = tabRefs.current.get(value);
    if (!container || !activeEl) {
      setIndicator(null);
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const activeRect = activeEl.getBoundingClientRect();
    setIndicator({
      left: activeRect.left - containerRect.left,
      width: activeRect.width,
    });
  }, [value]);

  useLayoutEffect(() => {
    updateIndicator();
    const container = containerRef.current;
    if (!container) {
      return undefined;
    }

    const resizeObserver = new ResizeObserver(updateIndicator);
    resizeObserver.observe(container);
    window.addEventListener("resize", updateIndicator);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateIndicator);
    };
  }, [updateIndicator, options]);

  return (
    <div
      aria-label={resolvedAriaLabel}
      className={`${styles.root} ${flush ? styles.flush : ""}`}
      ref={containerRef}
      role="tablist"
    >
      {indicator ? (
        <div
          aria-hidden="true"
          className={styles.indicator}
          style={{left: indicator.left, width: indicator.width}}
        />
      ) : null}
      {options.map((option) => {
        const active = value === option.value;
        const key = option.value || "all";
        const optionAriaLabel =
          typeof option.count === "number" ? `${option.label} (${option.count})` : option.label;

        return (
          <button
            aria-label={optionAriaLabel}
            aria-selected={active}
            className={`${styles.tab} ${active ? styles.active : ""}`}
            key={key}
            onClick={() => onChange(option.value)}
            ref={(element) => {
              if (element) {
                tabRefs.current.set(option.value, element);
              } else {
                tabRefs.current.delete(option.value);
              }
            }}
            role="tab"
            type="button"
          >
            <span className={styles.label}>{option.label}</span>
            {typeof option.count === "number" ? (
              <span className={styles.count}>({option.count})</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
