import type {ReactNode} from "react";

import {InfoTooltip} from "@/shared/ui/overlays/Tooltip";

import styles from "./Card.module.scss";

type CardProps = {
  title?: string;
  icon?: ReactNode;
  info?: string;
  children: ReactNode;
};

export function Card({title, icon, info, children}: CardProps) {
  return (
    <section className={styles.root}>
      {icon ? (
        <span aria-hidden="true" className={styles.watermark}>
          {icon}
        </span>
      ) : null}
      {title ? (
        <div className={styles.header}>
          {icon ? (
            <span aria-hidden="true" className={styles["title-icon"]}>
              {icon}
            </span>
          ) : null}
          <h2 className={styles.title}>{title}</h2>
          {info ? <InfoTooltip content={info} /> : null}
        </div>
      ) : null}
      <div className={styles.body}>{children}</div>
    </section>
  );
}
