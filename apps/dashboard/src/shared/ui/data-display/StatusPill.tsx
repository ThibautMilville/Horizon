import type {StatusTone} from "@/shared/lib/status-tone";

import styles from "./StatusPill.module.scss";

export type {StatusTone};

type StatusPillProps = {
  label: string;
  tone?: StatusTone;
};

export function StatusPill({label, tone = "neutral"}: StatusPillProps) {
  return <span className={`${styles.root} ${styles[tone]}`}>{label}</span>;
}
