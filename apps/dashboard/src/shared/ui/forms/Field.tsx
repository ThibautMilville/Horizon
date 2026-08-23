import type {ReactNode} from "react";

import {InfoTooltip} from "@/shared/ui/overlays/Tooltip";

import styles from "./form.module.scss";

type FieldProps = {
  label: string;
  children: ReactNode;
  span?: boolean;
  htmlFor?: string;
  info?: string;
};

export function Field({label, children, span = false, htmlFor, info}: FieldProps) {
  return (
    <label className={`${styles.field} ${span ? styles.span : ""}`} htmlFor={htmlFor}>
      <span className={styles["label-row"]}>
        <span className={styles.label}>{label}</span>
        {info ? <InfoTooltip content={info} /> : null}
      </span>
      {children}
    </label>
  );
}
