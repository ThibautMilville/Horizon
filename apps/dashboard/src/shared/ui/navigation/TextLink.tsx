import type {ReactNode} from "react";
import {Link, type LinkProps} from "react-router-dom";

import styles from "./TextLink.module.scss";

type TextLinkProps = {
  children: ReactNode;
} & Omit<LinkProps, "className">;

export function TextLink({children, ...props}: TextLinkProps) {
  return (
    <Link className={styles.root} {...props}>
      {children}
    </Link>
  );
}
