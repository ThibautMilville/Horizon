import {useEffect, useRef, useState} from "react";

import {formatUtcClock} from "@/shared/lib/datetime-local";
import {useI18n} from "@/shared/preferences/PreferencesProvider";

import type {MapBasemap} from "@/features/map/lib/map-basemap";

import styles from "./MapStatusBar.module.scss";

type MapStatusBarProps = {
  basemap: MapBasemap;
  cursorLabel: string | null;
  trackHours: number;
  trackVisible: boolean;
  hint: string;
  visible: boolean;
  onHeightChange?: (height: number) => void;
};

export function MapStatusBar({
  basemap,
  cursorLabel,
  trackHours,
  trackVisible,
  hint,
  visible,
  onHeightChange,
}: MapStatusBarProps) {
  const {t} = useI18n();
  const rootRef = useRef<HTMLElement>(null);
  const [clockLabel, setClockLabel] = useState(() => formatUtcClock(new Date()));
  const provider = basemap === "streets" ? t("map.providerCarto") : t("map.providerEsri");
  const style = basemap === "streets" ? t("map.styleStreets") : t("map.styleImagery");

  useEffect(() => {
    const timer = window.setInterval(() => setClockLabel(formatUtcClock(new Date())), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const element = rootRef.current;
    if (!element || !onHeightChange) {
      return;
    }

    const syncHeight = () => onHeightChange(element.offsetHeight);
    syncHeight();
    const observer = new ResizeObserver(syncHeight);
    observer.observe(element);
    return () => observer.disconnect();
  }, [onHeightChange, visible]);

  return (
    <footer
      aria-hidden={!visible}
      aria-label={t("map.statusAria")}
      className={`${styles.bar} ${visible ? "" : styles.hidden}`}
      ref={rootRef}
    >
      <div className={styles.row}>
        <div className={styles.cluster}>
          <span className={styles.meta}>{provider}</span>
          <span aria-hidden="true" className={styles.rule} />
          <span className={styles.meta}>{style}</span>
          <span aria-hidden="true" className={styles.rule} />
          <span className={styles.meta}>{t("map.projection")}</span>
        </div>
        <p className={styles.cursor}>{cursorLabel ?? t("map.cursorHint")}</p>
      </div>
      <div className={styles.row}>
        <div className={styles.cluster}>
          <ClockGlyph />
          <span className={styles.live} aria-hidden="true" />
          <p className={styles.clock}>{clockLabel}</p>
          {trackVisible ? (
            <span className={styles.pill}>
              {t("map.trackNextHours", {hours: String(trackHours)})}
            </span>
          ) : (
            <span className={styles["pill-muted"]}>{t("map.trackOff")}</span>
          )}
        </div>
        <p className={styles.hint}>{hint}</p>
      </div>
    </footer>
  );
}

function ClockGlyph() {
  return (
    <svg
      aria-hidden="true"
      className={styles.glyph}
      fill="none"
      height="14"
      viewBox="0 0 14 14"
      width="14"
    >
      <circle cx="7" cy="7" r="5.25" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M7 4.2V7l2 1.4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
    </svg>
  );
}
