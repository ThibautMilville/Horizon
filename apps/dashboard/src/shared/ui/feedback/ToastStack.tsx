import {useCallback, useEffect, useRef, useState, type CSSProperties} from "react";

import {translate} from "@/shared/i18n/messages";
import {readPreferences} from "@/shared/preferences/preferences";
import {CloseIcon} from "@/shared/ui/actions/action-icons";

import type {ToastItem, ToastTone} from "./toast-types";

import styles from "./ToastStack.module.scss";

type ToastStackProps = {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
  exitMs: number;
};

export function ToastStack({toasts, onDismiss, exitMs}: ToastStackProps) {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div aria-live="polite" aria-relevant="additions" className={styles.stack}>
      {toasts.map((toast) => (
        <ToastCard exitMs={exitMs} key={toast.id} onDismiss={onDismiss} toast={toast} />
      ))}
    </div>
  );
}

type ToastCardProps = {
  toast: ToastItem;
  onDismiss: (id: string) => void;
  exitMs: number;
};

function ToastCard({toast, onDismiss, exitMs}: ToastCardProps) {
  const [exiting, setExiting] = useState(false);
  const dismissingRef = useRef(false);

  const beginDismiss = useCallback(() => {
    if (dismissingRef.current) {
      return;
    }

    dismissingRef.current = true;
    setExiting(true);
    window.setTimeout(() => onDismiss(toast.id), exitMs);
  }, [exitMs, onDismiss, toast.id]);

  useEffect(() => {
    const timer = window.setTimeout(beginDismiss, toast.durationMs);
    return () => {
      window.clearTimeout(timer);
    };
  }, [beginDismiss, toast.durationMs]);

  const toastStyle = {
    "--toast-duration": `${toast.durationMs}ms`,
  } as CSSProperties;

  return (
    <div
      className={`${styles.toast} ${styles[`toast-${toast.tone}`]} ${exiting ? styles["toast-exiting"] : ""}`}
      role="status"
      style={toastStyle}
    >
      <div className={styles.body}>
        <span className={styles.icon} aria-hidden="true">
          <ToastIcon tone={toast.tone} />
        </span>
        <p className={styles.message}>{toast.message}</p>
        <button
          aria-label={translate(readPreferences().language, "common.close")}
          className={styles.dismiss}
          onClick={beginDismiss}
          type="button"
        >
          <CloseIcon size={12} />
        </button>
      </div>
      <div className={styles.duration} aria-hidden="true">
        <span className={styles["duration-bar"]} />
      </div>
    </div>
  );
}

function ToastIcon({tone}: {tone: ToastTone}) {
  switch (tone) {
    case "success":
      return (
        <svg fill="none" height="14" viewBox="0 0 14 14" width="14">
          <path
            d="M3.2 7.2 5.8 9.8 10.8 4.2"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </svg>
      );
    case "error":
      return (
        <svg fill="none" height="14" viewBox="0 0 14 14" width="14">
          <circle cx="7" cy="7" r="5.1" stroke="currentColor" strokeWidth="1.4" />
          <path
            d="M7 4.2v3.4M7 9.6h.01"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.5"
          />
        </svg>
      );
    case "warning":
      return (
        <svg fill="none" height="14" viewBox="0 0 14 14" width="14">
          <path
            d="M7 2.4 12.2 11.4H1.8L7 2.4Z"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="1.35"
          />
          <path
            d="M7 5.6v2.6M7 9.8h.01"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.4"
          />
        </svg>
      );
    default:
      return (
        <svg fill="none" height="14" viewBox="0 0 14 14" width="14">
          <circle cx="7" cy="7" r="5.1" stroke="currentColor" strokeWidth="1.4" />
          <path
            d="M7 6.2V10M7 4.2h.01"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.5"
          />
        </svg>
      );
  }
}
