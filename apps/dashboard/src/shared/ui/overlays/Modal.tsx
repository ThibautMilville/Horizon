import {useEffect, useId, useRef, type ReactNode} from "react";
import {createPortal} from "react-dom";

import {useI18n} from "@/shared/preferences/PreferencesProvider";
import {CloseIcon} from "@/shared/ui/actions/action-icons";

import styles from "./Modal.module.scss";

type ModalProps = {
  open: boolean;
  title: string;
  titleIcon?: ReactNode;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
};

export function Modal({open, title, titleIcon, onClose, children, footer}: ModalProps) {
  const {t} = useI18n();
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previous = document.activeElement;
    const node = dialogRef.current;
    node?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = originalOverflow;
      if (previous instanceof HTMLElement) {
        previous.focus();
      }
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return createPortal(
    <div className={styles.root}>
      <button
        aria-label={t("common.close")}
        className={styles.scrim}
        onClick={onClose}
        type="button"
      />
      <div
        aria-labelledby={titleId}
        aria-modal="true"
        className={styles.dialog}
        ref={dialogRef}
        role="dialog"
        tabIndex={-1}
      >
        <header className={styles.header}>
          <div className={styles["title-row"]}>
            {titleIcon ? (
              <span aria-hidden="true" className={styles["title-icon"]}>
                {titleIcon}
              </span>
            ) : null}
            <h2 className={styles.title} id={titleId}>
              {title}
            </h2>
          </div>
          <button
            aria-label={t("common.close")}
            className={styles.close}
            onClick={onClose}
            type="button"
          >
            <CloseIcon />
          </button>
        </header>
        <div className={styles.body}>{children}</div>
        {footer ? <footer className={styles.footer}>{footer}</footer> : null}
      </div>
    </div>,
    document.body,
  );
}
