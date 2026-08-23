import type {ReactNode} from "react";
import {Link} from "react-router-dom";

import {useI18n} from "@/shared/preferences/PreferencesProvider";

import type {MapAnchorPoint} from "@/features/map/lib/map-anchor";
import {formatLatLng} from "@/features/map/lib/map-format";
import type {FleetMapPoint} from "@/features/map/lib/map-points";

import styles from "./MapAssetPopover.module.scss";

type MapAssetPopoverProps = {
  point: FleetMapPoint;
  anchor: MapAnchorPoint;
  trackHint?: string;
  tracking?: boolean;
  onClear: () => void;
  onShare?: () => void;
  onToggleFocusAndTrack?: () => void;
  onScheduleContact?: () => void;
};

type PopoverRow = {
  id: string;
  label: string;
  value: ReactNode;
  mono?: boolean;
};

type PopoverAction = {
  id: string;
  label: string;
  icon: ReactNode;
  onClick: () => void;
  pressed?: boolean;
};

export function MapAssetPopover({
  point,
  anchor,
  trackHint,
  tracking = false,
  onClear,
  onShare,
  onToggleFocusAndTrack,
  onScheduleContact,
}: MapAssetPopoverProps) {
  const {t} = useI18n();
  const kindLabel = point.kind === "satellite" ? t("common.satellite") : t("common.station");

  const rows: PopoverRow[] = [
    {id: "name", label: t("common.name"), value: point.name},
    ...(point.status ? [{id: "status", label: t("common.status"), value: point.status}] : []),
    {
      id: "coords",
      label: t("common.coordinates"),
      value: formatLatLng(point.latitude, point.longitude),
      mono: true,
    },
    ...(trackHint ? [{id: "track", label: t("map.track"), value: trackHint}] : []),
  ];

  const actions: PopoverAction[] = [
    ...(point.kind === "satellite" && onToggleFocusAndTrack
      ? [
          {
            id: "focus",
            label: tracking ? t("map.stopTracking") : t("map.focusAndTrack"),
            icon: <FocusTrackGlyph />,
            onClick: onToggleFocusAndTrack,
            pressed: tracking,
          },
        ]
      : []),
    ...(onShare
      ? [
          {
            id: "share",
            label: t("map.shareLink"),
            icon: <ShareGlyph />,
            onClick: onShare,
          },
        ]
      : []),
    ...(onScheduleContact
      ? [
          {
            id: "schedule",
            label: t("map.scheduleContact"),
            icon: <ScheduleGlyph />,
            onClick: onScheduleContact,
          },
        ]
      : []),
  ];

  return (
    <aside
      aria-label={t("map.detailsAria", {kind: kindLabel})}
      className={`${styles.popover} ${styles[anchor.placement]}`}
      style={{left: anchor.x, top: anchor.y}}
    >
      <div className={styles.head}>
        <button
          aria-label={t("common.close")}
          className={styles.icon}
          onClick={onClear}
          type="button"
        >
          <CloseGlyph />
        </button>
        <p className={styles.kind}>
          <KindGlyph kind={point.kind} />
          {kindLabel}
        </p>
        <Link aria-label={t("common.openDetail")} className={styles.icon} to={point.href}>
          <ChevronGlyph />
        </Link>
      </div>
      <dl className={styles.rows}>
        {rows.map((row) => (
          <div className={styles.row} key={row.id}>
            <dt>{row.label}</dt>
            <dd className={row.mono ? styles.mono : undefined}>{row.value}</dd>
          </div>
        ))}
      </dl>
      {actions.length > 0 ? (
        <div className={styles.actions}>
          {actions.map((action) => (
            <button
              aria-pressed={action.pressed}
              className={`${styles.action} ${action.pressed ? styles["action-on"] : ""}`}
              key={action.id}
              onClick={action.onClick}
              type="button"
            >
              {action.icon}
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      ) : null}
    </aside>
  );
}

function CloseGlyph() {
  return (
    <svg aria-hidden="true" fill="none" height="14" viewBox="0 0 14 14" width="14">
      <circle cx="7" cy="7" r="5.4" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="m4.8 4.8 4.4 4.4M9.2 4.8 4.8 9.2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function ChevronGlyph() {
  return (
    <svg aria-hidden="true" fill="none" height="14" viewBox="0 0 14 14" width="14">
      <circle cx="7" cy="7" r="5.4" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M6 4.6 8.6 7 6 9.4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.3"
      />
    </svg>
  );
}

function FocusTrackGlyph() {
  return (
    <svg aria-hidden="true" fill="none" height="14" viewBox="0 0 14 14" width="14">
      <circle cx="7" cy="7" r="2.1" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M7 1.6v1.8M7 10.6v1.8M1.6 7h1.8M10.6 7h1.8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function ShareGlyph() {
  return (
    <svg aria-hidden="true" fill="none" height="14" viewBox="0 0 14 14" width="14">
      <path
        d="M5.2 7.6 8.8 5.4M5.2 6.4 8.8 8.6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.2"
      />
      <circle cx="4.2" cy="7" r="2.1" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="9.8" cy="4.4" r="2.1" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="9.8" cy="9.6" r="2.1" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function ScheduleGlyph() {
  return (
    <svg aria-hidden="true" fill="none" height="14" viewBox="0 0 14 14" width="14">
      <rect height="9" rx="1.2" stroke="currentColor" strokeWidth="1.2" width="10" x="2" y="3.2" />
      <path
        d="M2 5.8h10M5 2.2v2M9 2.2v2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function KindGlyph({kind}: {kind: FleetMapPoint["kind"]}) {
  if (kind === "station") {
    return (
      <svg aria-hidden="true" fill="none" height="12" viewBox="0 0 12 12" width="12">
        <path d="M6 10V6.4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.2" />
        <path
          d="M3.2 6.5a2.8 2.8 0 0 1 5.6 0"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.1"
        />
        <circle cx="6" cy="6.4" fill="currentColor" r="0.85" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" fill="none" height="12" viewBox="0 0 12 12" width="12">
      <rect
        height="3.2"
        rx="0.6"
        stroke="currentColor"
        strokeWidth="1.1"
        transform="rotate(45 6 6)"
        width="3.2"
        x="4.4"
        y="4.4"
      />
    </svg>
  );
}
