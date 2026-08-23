import type {ReactNode} from "react";

import styles from "./ErrorState.module.scss";

type ErrorStateProps = {
  title: string;
  message?: string;
  action?: ReactNode;
};

export function ErrorState({title, message, action}: ErrorStateProps) {
  return (
    <div className={styles.root} role="alert">
      <h2 className={styles.title}>{title}</h2>
      {message ? <p className={styles.message}>{message}</p> : null}
      {action ? <div className={styles.action}>{action}</div> : null}
    </div>
  );
}
