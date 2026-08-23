import type {ReactNode} from "react";
import {Link} from "react-router-dom";

import styles from "./StatCard.module.scss";

type StatCardTone = "accent" | "warn" | "danger";

type StatCardProps = {
  label: string;
  value: ReactNode;
  icon: ReactNode;
  to?: string;
  tone?: StatCardTone;
};

export function StatCard({label, value, icon, to, tone = "accent"}: StatCardProps) {
  const className = `${styles.root} ${styles[tone]}`;
  const body = (
    <>
      <span aria-hidden="true" className={styles.watermark}>
        {icon}
      </span>
      <p className={styles.label}>{label}</p>
      <p className={styles.value}>{value}</p>
    </>
  );

  if (to) {
    return (
      <Link className={`${className} ${styles.link}`} to={to}>
        {body}
      </Link>
    );
  }

  return <section className={className}>{body}</section>;
}
