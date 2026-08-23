import {useState} from "react";

import {PreferenceControls} from "@/shared/preferences/PreferenceControls";
import {useI18n} from "@/shared/preferences/PreferencesProvider";
import {Button} from "@/shared/ui/actions/Button";
import {Modal} from "@/shared/ui/overlays/Modal";
import {Tooltip} from "@/shared/ui/overlays/Tooltip";

import styles from "./ShellAccessibilityControl.module.scss";

type ShellAccessibilityControlProps = {
  collapsed: boolean;
};

function AccessibilityIcon() {
  return (
    <svg fill="none" height="16" viewBox="0 0 16 16" width="16">
      <circle cx="8" cy="3.1" fill="currentColor" r="1.55" />
      <path
        d="M4.2 6.2h7.6M8 5.1v4.4M5.4 13.2 8 9.5l2.6 3.7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.35"
      />
    </svg>
  );
}

export function ShellAccessibilityControl({collapsed}: ShellAccessibilityControlProps) {
  const {t} = useI18n();
  const [open, setOpen] = useState(false);

  const trigger = (
    <button
      aria-haspopup="dialog"
      aria-label={t("a11y.open")}
      className={`${styles.trigger} ${collapsed ? styles["trigger-collapsed"] : ""}`}
      onClick={() => setOpen(true)}
      type="button"
    >
      <span aria-hidden="true" className={styles.icon}>
        <AccessibilityIcon />
      </span>
      {collapsed ? null : <span className={styles.label}>{t("a11y.open")}</span>}
    </button>
  );

  return (
    <div className={styles.root}>
      {collapsed ? (
        <Tooltip content={t("a11y.open")} position="right">
          {trigger}
        </Tooltip>
      ) : (
        trigger
      )}

      <Modal
        footer={
          <Button onClick={() => setOpen(false)} type="button" variant="primary">
            {t("a11y.done")}
          </Button>
        }
        onClose={() => setOpen(false)}
        open={open}
        title={t("a11y.title")}
        titleIcon={<AccessibilityIcon />}
      >
        <p className={styles.lead}>{t("a11y.lead")}</p>

        <PreferenceControls fieldClassName={styles.field} labelClassName={styles["field-label"]} />
      </Modal>
    </div>
  );
}
