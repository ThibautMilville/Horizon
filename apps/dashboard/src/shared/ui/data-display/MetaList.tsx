import type {ReactNode} from "react";

import styles from "./MetaList.module.scss";

export type MetaListItem = {
  term: string;
  description: ReactNode;
};

type MetaListProps = {
  items: MetaListItem[];
};

export function MetaList({items}: MetaListProps) {
  return (
    <dl className={styles.root}>
      {items.map((item) => (
        <div className={styles.item} key={item.term}>
          <dt className={styles.term}>{item.term}</dt>
          <dd className={styles.description}>{item.description}</dd>
        </div>
      ))}
    </dl>
  );
}
