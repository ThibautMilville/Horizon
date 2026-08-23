import type {ReactNode} from "react";

import styles from "./PageHeader.module.scss";

type PageHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function PageHeader({title, description, action}: PageHeaderProps) {
  return (
    <header className={styles.root}>
      <div className={styles.copy}>
        <h1 className={styles.title}>
          <span className={styles["title-text"]}>{title}</span>
        </h1>
        {description ? <p className={styles.description}>{description}</p> : null}
      </div>
      {action ? <div className={styles.action}>{action}</div> : null}
    </header>
  );
}
