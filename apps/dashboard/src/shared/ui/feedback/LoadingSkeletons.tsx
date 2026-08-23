import type {ReactNode} from "react";

import {useI18n} from "@/shared/preferences/PreferencesProvider";

import {Skeleton} from "./Skeleton";

import skeletonStyles from "./Skeleton.module.scss";
import styles from "./LoadingSkeletons.module.scss";

type LoadingShellProps = {
  children: ReactNode;
};

function LoadingShell({children}: LoadingShellProps) {
  const {t} = useI18n();

  return (
    <div aria-busy="true" className={styles.shell} role="status">
      <span className={skeletonStyles.a11y}>{t("common.loading")}</span>
      {children}
    </div>
  );
}

function CardSkeleton({children}: {children: ReactNode}) {
  return (
    <div className={styles.card}>
      <div className={styles["card-header"]}>
        <Skeleton className={styles["card-icon"]} height="1.65rem" width="1.65rem" />
        <Skeleton height="0.65rem" width="6.5rem" />
      </div>
      <div className={styles["card-body"]}>{children}</div>
    </div>
  );
}

type TableColumnsVariant = "list" | "attention" | "compact";

function DataTableSkeleton({
  columns = "list",
  rows = 5,
}: {
  columns?: TableColumnsVariant;
  rows?: number;
}) {
  const columnClass =
    columns === "attention"
      ? styles["table-columns-attention"]
      : columns === "compact"
        ? styles["table-columns-compact"]
        : styles["table-columns-list"];

  return (
    <>
      <div className={styles["table-toolbar"]}>
        <Skeleton className={styles["table-search"]} height="2.35rem" width="100%" />
        <Skeleton className={styles["table-filter"]} height="2.35rem" width="2.35rem" />
      </div>
      <div className={`${styles["table-head"]} ${columnClass}`}>
        {columns === "list" ? (
          <>
            <Skeleton className={styles.thumb} height="0.55rem" width="100%" />
            <Skeleton height="0.55rem" width="72%" />
            <Skeleton className={styles["col-mid"]} height="0.55rem" width="58%" />
            <Skeleton className={styles["col-mid"]} height="0.55rem" width="64%" />
            <Skeleton className={styles["col-mid"]} height="0.55rem" width="52%" />
            <Skeleton className={styles["col-action"]} height="0.55rem" width="100%" />
          </>
        ) : columns === "attention" ? (
          <>
            <Skeleton height="0.55rem" width="68%" />
            <Skeleton className={styles["col-mid"]} height="0.55rem" width="48%" />
            <Skeleton className={styles["col-mid"]} height="0.55rem" width="56%" />
            <Skeleton className={styles["col-action"]} height="0.55rem" width="100%" />
          </>
        ) : (
          <>
            <Skeleton height="0.55rem" width="42%" />
            <Skeleton height="0.55rem" width="64%" />
          </>
        )}
      </div>
      {Array.from({length: rows}, (_, index) => (
        <div className={`${styles["table-row"]} ${columnClass}`} key={index}>
          {columns === "list" ? (
            <>
              <Skeleton className={styles.thumb} height="2.5rem" width="2.5rem" />
              <Skeleton height="0.8rem" width={`${72 - index * 3}%`} />
              <Skeleton
                className={styles["col-mid"]}
                height="0.8rem"
                width={`${58 - index * 2}%`}
              />
              <Skeleton
                className={styles["col-mid"]}
                height="0.8rem"
                width={`${52 - index * 2}%`}
              />
              <Skeleton className={styles["col-mid"]} height="1.4rem" width="4.5rem" />
              <Skeleton className={styles["col-action"]} height="2rem" width="2rem" />
            </>
          ) : columns === "attention" ? (
            <>
              <Skeleton height="0.8rem" width={`${70 - index * 4}%`} />
              <Skeleton
                className={styles["col-mid"]}
                height="0.8rem"
                width={`${48 - index * 2}%`}
              />
              <Skeleton className={styles["col-mid"]} height="1.4rem" width="5.5rem" />
              <Skeleton className={styles["col-action"]} height="2rem" width="2rem" />
            </>
          ) : (
            <>
              <Skeleton height="0.8rem" width={`${42 - index * 2}%`} />
              <Skeleton height="0.8rem" width={`${68 - index * 3}%`} />
            </>
          )}
        </div>
      ))}
    </>
  );
}

function StatCardSkeleton() {
  return (
    <div className={styles["stat-card"]}>
      <Skeleton className={styles["stat-label"]} height="0.65rem" width="72%" />
      <Skeleton className={styles["stat-value"]} height="2rem" width="58%" />
    </div>
  );
}

function MetaListSkeleton({rows = 4}: {rows?: number}) {
  return (
    <div className={styles["meta-list"]}>
      {Array.from({length: rows}, (_, index) => (
        <div className={styles["meta-row"]} key={index}>
          <Skeleton height="0.6rem" width={`${34 + index * 2}%`} />
          <Skeleton height="0.85rem" width={`${58 - index * 3}%`} />
        </div>
      ))}
    </div>
  );
}

export function TablePageSkeleton() {
  return (
    <LoadingShell>
      <CardSkeleton>
        <DataTableSkeleton columns="list" />
      </CardSkeleton>
    </LoadingShell>
  );
}

export function DetailPageSkeleton() {
  return (
    <LoadingShell>
      <div className={styles["detail-stack"]}>
        <div className={styles["detail-hero"]}>
          <Skeleton className={styles["detail-cover"]} height="100%" width="100%" />
          <CardSkeleton>
            <MetaListSkeleton rows={4} />
          </CardSkeleton>
        </div>
        <div className={styles["detail-grid"]}>
          <CardSkeleton>
            <MetaListSkeleton rows={3} />
          </CardSkeleton>
          <CardSkeleton>
            <MetaListSkeleton rows={3} />
          </CardSkeleton>
        </div>
        <CardSkeleton>
          <DataTableSkeleton columns="compact" rows={4} />
        </CardSkeleton>
        <CardSkeleton>
          <div className={styles["tle-block"]}>
            <Skeleton height="0.85rem" width="88%" />
            <Skeleton height="0.85rem" width="76%" />
          </div>
        </CardSkeleton>
        <CardSkeleton>
          <DataTableSkeleton columns="compact" rows={3} />
        </CardSkeleton>
      </div>
    </LoadingShell>
  );
}

export function FormPageSkeleton() {
  return (
    <LoadingShell>
      <CardSkeleton>
        <div className={styles["form-grid"]}>
          {Array.from({length: 6}, (_, index) => (
            <div className={styles["form-field"]} key={index}>
              <Skeleton height="0.65rem" width="38%" />
              <Skeleton height="2.35rem" width="100%" />
            </div>
          ))}
          <div className={`${styles["form-field"]} ${styles["form-span"]}`}>
            <Skeleton height="0.65rem" width="32%" />
            <Skeleton height="5.5rem" width="100%" />
          </div>
          <div className={`${styles["form-field"]} ${styles["form-span"]}`}>
            <Skeleton height="0.65rem" width="36%" />
            <Skeleton height="5.5rem" width="100%" />
          </div>
          <Skeleton className={styles["form-span"]} height="2.5rem" width="9rem" />
        </div>
      </CardSkeleton>
    </LoadingShell>
  );
}

export function FleetPageSkeleton() {
  return (
    <LoadingShell>
      <div className={styles["fleet-metrics"]}>
        {Array.from({length: 5}, (_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>
      <div className={styles["fleet-charts"]}>
        <div className={styles["chart-card"]}>
          <Skeleton height="0.7rem" width="42%" />
          <Skeleton className={styles["chart-area"]} height="12rem" width="100%" />
        </div>
        <div className={styles["chart-card"]}>
          <Skeleton height="0.7rem" width="48%" />
          <Skeleton className={styles["chart-area"]} height="12rem" width="100%" />
        </div>
      </div>
      <CardSkeleton>
        <DataTableSkeleton columns="attention" rows={4} />
      </CardSkeleton>
    </LoadingShell>
  );
}

export function MapStageSkeleton() {
  return (
    <LoadingShell>
      <div className={styles["map-stage-shell"]}>
        <div className={styles["map-vignette"]} aria-hidden="true" />
        <Skeleton className={styles["map-canvas"]} height="100%" width="100%" />
        <div className={styles["map-tools-stack"]}>
          <div className={styles["map-toolbar"]}>
            {Array.from({length: 5}, (_, index) => (
              <div className={styles["map-toolbar-group"]} key={index}>
                {Array.from({length: index === 1 ? 5 : 3}, (_, buttonIndex) => (
                  <Skeleton
                    className={styles["map-toolbar-button"]}
                    key={buttonIndex}
                    height="2.15rem"
                    width="2.15rem"
                  />
                ))}
              </div>
            ))}
          </div>
          <Skeleton className={styles["map-search"]} height="2.5rem" width="100%" />
        </div>
        <Skeleton className={styles["map-scale"]} height="1.35rem" width="3.5rem" />
        <div className={styles["map-attribution"]}>
          <Skeleton className={styles["map-attribution-chip"]} height="0.45rem" width="100%" />
          <Skeleton className={styles["map-attribution-chip"]} height="0.45rem" width="100%" />
        </div>
        <div className={styles["map-status"]}>
          <Skeleton className={styles["map-status-copy"]} height="0.7rem" width="42%" />
          <Skeleton className={styles["map-status-meta"]} height="0.7rem" width="28%" />
        </div>
      </div>
    </LoadingShell>
  );
}

export function SearchResultsSkeleton() {
  const {t} = useI18n();

  return (
    <div aria-busy="true" className={styles["search-results"]} role="status">
      <span className={skeletonStyles.a11y}>{t("common.loading")}</span>
      {Array.from({length: 4}, (_, index) => (
        <div className={styles["search-result"]} key={index}>
          <div className={styles["search-copy"]}>
            <Skeleton height="0.85rem" width={`${78 - index * 5}%`} />
            <Skeleton height="0.7rem" width={`${52 - index * 3}%`} />
          </div>
          <Skeleton className={styles["search-badge"]} height="1.2rem" width="4.5rem" />
        </div>
      ))}
    </div>
  );
}
