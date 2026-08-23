import styles from "./EmptyState.module.scss";

type EmptyStateProps = {
  message: string;
  variant?: "panel" | "table";
};

export function EmptyState({message, variant = "panel"}: EmptyStateProps) {
  return (
    <div className={`${styles.root} ${variant === "table" ? styles.table : ""}`}>
      <p className={styles.message}>{message}</p>
    </div>
  );
}
