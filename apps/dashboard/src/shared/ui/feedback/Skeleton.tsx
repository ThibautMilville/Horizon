import styles from "./Skeleton.module.scss";

type SkeletonProps = {
  className?: string;
  height?: string;
  width?: string;
};

export function Skeleton({className, height = "0.75rem", width = "100%"}: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={`${styles.block}${className ? ` ${className}` : ""}`}
      style={{height, width}}
    />
  );
}
