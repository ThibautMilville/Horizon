import type {ButtonHTMLAttributes, ReactNode} from "react";
import {Link, type LinkProps} from "react-router-dom";

import styles from "./Button.module.scss";

export type ButtonVariant = "primary" | "secondary" | "text";

function buttonClassName(variant: ButtonVariant, shine?: boolean) {
  const enableShine = shine ?? variant !== "text";
  return `${styles.root} ${styles[variant]} ${enableShine ? styles.shine : ""}`;
}

type ButtonProps = {
  variant?: ButtonVariant;
  shine?: boolean;
  children: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className">;

export function Button({
  variant = "primary",
  shine,
  type = "button",
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={buttonClassName(variant, shine)} type={type} {...props}>
      <span className={styles.label}>{children}</span>
    </button>
  );
}

type ButtonLinkProps = {
  variant?: ButtonVariant;
  shine?: boolean;
  children: ReactNode;
} & Omit<LinkProps, "className">;

export function ButtonLink({variant = "secondary", shine, children, ...props}: ButtonLinkProps) {
  return (
    <Link className={buttonClassName(variant, shine)} {...props}>
      <span className={styles.label}>{children}</span>
    </Link>
  );
}
