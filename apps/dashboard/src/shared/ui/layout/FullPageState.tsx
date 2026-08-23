import type {ReactNode} from "react";

import {BrandMark} from "@/shared/ui/actions/BrandMark";

import styles from "./FullPageState.module.scss";

type FullPageStateProps = {
  code?: string;
  description?: string;
  title: string;
  variant?: "neutral" | "error";
  action?: ReactNode;
  secondaryAction?: ReactNode;
};

export function FullPageState({
  code,
  description,
  title,
  variant = "neutral",
  action,
  secondaryAction,
}: FullPageStateProps) {
  const pageClass = [styles.page, variant === "error" ? styles["page-error"] : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={pageClass}>
      <section
        aria-labelledby="full-page-state-title"
        className={styles.card}
        role={variant === "error" ? "alert" : undefined}
      >
        <div className={styles.brand}>
          <BrandMark />
          <span className={styles["brand-name"]}>Horizon</span>
        </div>
        {code ? <p className={styles.code}>{code}</p> : null}
        <h1 className={styles.title} id="full-page-state-title">
          {title}
        </h1>
        {description ? <p className={styles.description}>{description}</p> : null}
        {action || secondaryAction ? (
          <div className={styles.actions}>
            {action}
            {secondaryAction}
          </div>
        ) : null}
      </section>
    </div>
  );
}
