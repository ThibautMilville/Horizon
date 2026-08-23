import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {createPortal} from "react-dom";

import {useI18n} from "@/shared/preferences/PreferencesProvider";
import {useFloatingLayerEvents} from "@/shared/ui/overlays/useFloatingLayerEvents";
import {utcTodayDateOnly} from "@/shared/lib/datetime-local";

import {chooseAnchoredMenuCoords} from "./anchored-menu";
import {
  buildMonthCells,
  buildYearOptions,
  composeDateTimeValue,
  DATE_PICKER_MONTHS,
  formatDatePickerDisplay,
  isDateOutOfRange,
  isSameDay,
  monthLabel,
  monthLongLabel,
  shiftCalendarCursor,
  splitDateTimeValue,
  toDateOnly,
  toIsoDate,
  weekdayLabels,
  yearDecadeStart,
  type DatePickerPanel,
} from "./date-picker";

import styles from "./DatePicker.module.scss";

type DatePickerProps = {
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  includeTime?: boolean;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  "aria-label"?: string;
};

export function DatePicker({
  value,
  onChange,
  min,
  max,
  includeTime = false,
  placeholder,
  disabled = false,
  required = false,
  id,
  "aria-label": ariaLabel,
}: DatePickerProps) {
  const {t, language} = useI18n();
  const resolvedPlaceholder = placeholder ?? t("datepicker.selectDate");
  const weekdays = useMemo(() => weekdayLabels(language), [language]);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState<DatePickerPanel>("day");
  const [menuStyle, setMenuStyle] = useState<CSSProperties | null>(null);
  const [compact, setCompact] = useState(false);

  const {datePart, timePart} = useMemo(
    () => splitDateTimeValue(value, includeTime),
    [includeTime, value],
  );
  const selectedDate = useMemo(() => toDateOnly(datePart), [datePart]);
  const minDate = useMemo(() => toDateOnly(min ?? ""), [min]);
  const maxDate = useMemo(() => toDateOnly(max ?? ""), [max]);
  const today = utcTodayDateOnly();

  const [visibleMonth, setVisibleMonth] = useState<Date>(() => {
    const base = selectedDate ?? new Date();
    return new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), 1));
  });
  const [draftTime, setDraftTime] = useState(timePart);

  useEffect(() => {
    if (selectedDate) {
      setVisibleMonth(
        new Date(Date.UTC(selectedDate.getUTCFullYear(), selectedDate.getUTCMonth(), 1)),
      );
    }
  }, [selectedDate]);

  useEffect(() => {
    setDraftTime(timePart);
  }, [timePart]);

  useEffect(() => {
    if (!open) {
      setPanel("day");
    }
  }, [open]);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  const setMenuElement = useCallback((element: HTMLDivElement | null) => {
    menuRef.current = element;
    element?.focus();
  }, []);

  const updateMenuPosition = useCallback(() => {
    if (!triggerRef.current) {
      return;
    }

    const rect = triggerRef.current.getBoundingClientRect();
    const coords = chooseAnchoredMenuCoords({
      trigger: {
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        left: rect.left,
        width: rect.width,
      },
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      preferredMaxHeight: includeTime ? 460 : 400,
      minHeight: includeTime ? 300 : 260,
      minWidth: 300,
    });

    setCompact(coords.compact);
    setMenuStyle({
      position: "fixed",
      top: coords.top,
      bottom: coords.bottom,
      left: coords.left,
      width: coords.width,
      maxHeight: coords.maxHeight,
    });
  }, [includeTime]);

  useLayoutEffect(() => {
    if (!open) {
      setMenuStyle(null);
      return;
    }

    updateMenuPosition();
    const frame = window.requestAnimationFrame(() => updateMenuPosition());
    return () => window.cancelAnimationFrame(frame);
  }, [open, updateMenuPosition, visibleMonth, panel]);

  useFloatingLayerEvents(open, {
    onPointerDown: (event) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) {
        return;
      }
      close();
    },
    onKeyDown: (event) => {
      if (event.key !== "Escape") {
        return;
      }
      event.preventDefault();
      if (panel !== "day") {
        setPanel(panel === "year" ? "month" : "day");
        return;
      }
      close();
    },
    onReposition: updateMenuPosition,
  });

  const days = useMemo(() => buildMonthCells(visibleMonth), [visibleMonth]);
  const years = useMemo(() => buildYearOptions(visibleMonth.getUTCFullYear()), [visibleMonth]);

  const emitValue = (nextDate: string, nextTime = draftTime) => {
    onChange(composeDateTimeValue(nextDate, includeTime, nextTime));
  };

  const selectToday = () => {
    if (isDateOutOfRange(today, minDate, maxDate)) {
      return;
    }
    setVisibleMonth(new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1)));
    setPanel("day");
    emitValue(toIsoDate(today), draftTime);
    if (!includeTime) {
      close();
    }
  };

  const prevNavLabel =
    panel === "day"
      ? t("datepicker.prevMonth")
      : panel === "month"
        ? t("datepicker.prevYear")
        : t("datepicker.prevYears");
  const nextNavLabel =
    panel === "day"
      ? t("datepicker.nextMonth")
      : panel === "month"
        ? t("datepicker.nextYear")
        : t("datepicker.nextYears");

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={ariaLabel}
        aria-required={required || undefined}
        className={`${styles.trigger} ${open ? styles["trigger-open"] : ""}`}
        disabled={disabled}
        id={id}
        onClick={() => {
          if (!disabled) {
            setOpen((current) => !current);
          }
        }}
        ref={triggerRef}
        type="button"
      >
        <span className={`${styles.value} ${value ? "" : styles.placeholder}`}>
          {value ? formatDatePickerDisplay(value, includeTime, language) : resolvedPlaceholder}
        </span>
        <span aria-hidden="true" className={styles.glyph}>
          <CalendarGlyph />
        </span>
      </button>

      {open && menuStyle
        ? createPortal(
            <div
              aria-label={resolvedPlaceholder}
              aria-modal="true"
              className={`${styles.menu} ${compact ? styles["menu-compact"] : ""}`}
              ref={setMenuElement}
              role="dialog"
              style={menuStyle}
              tabIndex={-1}
            >
              <div className={styles.toolbar}>
                <button
                  aria-label={prevNavLabel}
                  className={styles.nav}
                  onClick={() =>
                    setVisibleMonth((current) => shiftCalendarCursor(current, panel, -1))
                  }
                  type="button"
                >
                  <ChevronGlyph direction="left" />
                </button>

                <div className={styles.captions}>
                  {panel === "day" ? (
                    <>
                      <button
                        className={styles.caption}
                        onClick={() => setPanel("month")}
                        type="button"
                      >
                        {monthLongLabel(visibleMonth.getUTCMonth(), language)}
                      </button>
                      <button
                        className={styles.caption}
                        onClick={() => setPanel("year")}
                        type="button"
                      >
                        {visibleMonth.getUTCFullYear()}
                      </button>
                    </>
                  ) : null}
                  {panel === "month" ? (
                    <button
                      className={`${styles.caption} ${styles["caption-strong"]}`}
                      onClick={() => setPanel("year")}
                      type="button"
                    >
                      {visibleMonth.getUTCFullYear()}
                    </button>
                  ) : null}
                  {panel === "year" ? (
                    <button
                      className={`${styles.caption} ${styles["caption-strong"]}`}
                      onClick={() => setPanel("month")}
                      type="button"
                    >
                      {yearDecadeStart(visibleMonth.getUTCFullYear())}-
                      {yearDecadeStart(visibleMonth.getUTCFullYear()) + 11}
                    </button>
                  ) : null}
                </div>

                <button
                  aria-label={nextNavLabel}
                  className={styles.nav}
                  onClick={() =>
                    setVisibleMonth((current) => shiftCalendarCursor(current, panel, 1))
                  }
                  type="button"
                >
                  <ChevronGlyph direction="right" />
                </button>
              </div>

              {panel === "day" ? (
                <>
                  <div className={styles.weekdays}>
                    {weekdays.map((day) => (
                      <span className={styles.weekday} key={day}>
                        {day}
                      </span>
                    ))}
                  </div>
                  <div className={styles.grid}>
                    {days.map((cell) => {
                      if (!cell.date) {
                        return <span className={styles.blank} key={cell.key} />;
                      }

                      const dayDate = cell.date;
                      const dayDisabled = isDateOutOfRange(dayDate, minDate, maxDate);
                      const selected = selectedDate !== null && isSameDay(selectedDate, dayDate);
                      const isToday = isSameDay(today, dayDate);

                      return (
                        <button
                          aria-current={isToday ? "date" : undefined}
                          className={`${styles.day} ${selected ? styles["day-selected"] : ""} ${isToday ? styles["day-today"] : ""} ${dayDisabled ? styles["day-disabled"] : ""}`}
                          disabled={dayDisabled}
                          key={cell.key}
                          onClick={() => {
                            emitValue(toIsoDate(dayDate), draftTime);
                            if (!includeTime) {
                              close();
                            }
                          }}
                          type="button"
                        >
                          {dayDate.getUTCDate()}
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : null}

              {panel === "month" ? (
                <div className={styles["picker-grid"]}>
                  {DATE_PICKER_MONTHS.map((monthIndex) => {
                    const active = visibleMonth.getUTCMonth() === monthIndex;
                    return (
                      <button
                        className={`${styles.chip} ${active ? styles["chip-active"] : ""}`}
                        key={monthIndex}
                        onClick={() => {
                          setVisibleMonth(
                            new Date(Date.UTC(visibleMonth.getUTCFullYear(), monthIndex, 1)),
                          );
                          setPanel("day");
                        }}
                        type="button"
                      >
                        {monthLabel(monthIndex, language)}
                      </button>
                    );
                  })}
                </div>
              ) : null}

              {panel === "year" ? (
                <div className={styles["picker-grid"]}>
                  {years.map((year) => {
                    const active = visibleMonth.getUTCFullYear() === year;
                    return (
                      <button
                        className={`${styles.chip} ${active ? styles["chip-active"] : ""}`}
                        key={year}
                        onClick={() => {
                          setVisibleMonth(new Date(Date.UTC(year, visibleMonth.getUTCMonth(), 1)));
                          setPanel("month");
                        }}
                        type="button"
                      >
                        {year}
                      </button>
                    );
                  })}
                </div>
              ) : null}

              <div className={styles.footer}>
                <button
                  className={styles.confirm}
                  disabled={isDateOutOfRange(today, minDate, maxDate)}
                  onClick={selectToday}
                  type="button"
                >
                  {t("datepicker.today")}
                </button>
                {includeTime ? (
                  <div className={styles["time-row"]}>
                    <label className={styles["time-field"]}>
                      <span>{t("datepicker.timeUtc")}</span>
                      <input
                        className={styles["time-input"]}
                        onChange={(event) => {
                          const nextTime = event.target.value;
                          setDraftTime(nextTime);
                          if (datePart) {
                            emitValue(datePart, nextTime);
                          }
                        }}
                        type="time"
                        value={draftTime}
                      />
                    </label>
                    <button
                      className={styles.confirm}
                      disabled={!datePart}
                      onClick={close}
                      type="button"
                    >
                      {t("a11y.done")}
                    </button>
                  </div>
                ) : (
                  <button className={styles.confirm} onClick={close} type="button">
                    {t("common.close")}
                  </button>
                )}
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

function CalendarGlyph() {
  return (
    <svg fill="none" height="16" viewBox="0 0 16 16" width="16">
      <rect height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3" width="12" x="2" y="3.5" />
      <path d="M2 6.5h12" stroke="currentColor" strokeWidth="1.3" />
      <path d="M5 2v2.5M11 2v2.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.3" />
    </svg>
  );
}

function ChevronGlyph({direction}: {direction: "left" | "right"}) {
  return (
    <svg fill="none" height="14" viewBox="0 0 14 14" width="14">
      <path
        d={direction === "left" ? "M8.5 3.5 5 7l3.5 3.5" : "M5.5 3.5 9 7l-3.5 3.5"}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.4"
      />
    </svg>
  );
}
