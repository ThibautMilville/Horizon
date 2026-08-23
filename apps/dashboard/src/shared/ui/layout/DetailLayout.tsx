import type {ReactNode} from "react";

import formStyles from "@/shared/ui/forms/form.module.scss";

import styles from "./DetailLayout.module.scss";

type DetailLayoutProps = {
  children: ReactNode;
};

export function DetailStack({children}: DetailLayoutProps) {
  return <div className={styles.stack}>{children}</div>;
}

export function DetailGrid({children}: DetailLayoutProps) {
  return <div className={styles.grid}>{children}</div>;
}

export function DetailActions({children}: DetailLayoutProps) {
  return <div className={formStyles.actions}>{children}</div>;
}

export function DetailHero({children}: DetailLayoutProps) {
  return <div className={styles.hero}>{children}</div>;
}
