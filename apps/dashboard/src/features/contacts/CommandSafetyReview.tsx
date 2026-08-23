import {useI18n} from "@/shared/preferences/PreferencesProvider";
import {StatusPill, type StatusTone} from "@/shared/ui/data-display/StatusPill";

import type {
  CommandRiskCode,
  CommandRiskLevel,
  CommandSafetyAssessment,
} from "@/shared/lib/command-safety";

import styles from "./CommandSafetyReview.module.scss";

const LEVEL_TONES: Record<CommandRiskLevel, StatusTone> = {
  safe: "ok",
  caution: "warn",
  danger: "danger",
};

const FINDING_KEYS = {
  "destructive-delete": "contacts.safety.finding.destructiveDelete",
  "disk-write": "contacts.safety.finding.diskWrite",
  privileged: "contacts.safety.finding.privileged",
  "remote-pipe": "contacts.safety.finding.remotePipe",
  "wide-permissions": "contacts.safety.finding.widePermissions",
  "sensitive-configuration": "contacts.safety.finding.sensitiveConfiguration",
  "invalid-configuration": "contacts.safety.finding.invalidConfiguration",
} as const;

type CommandSafetyReviewProps = {
  review: CommandSafetyAssessment;
  acknowledged?: boolean;
  onAcknowledgedChange?: (acknowledged: boolean) => void;
};

export function CommandSafetyReview({
  review,
  acknowledged = false,
  onAcknowledgedChange,
}: CommandSafetyReviewProps) {
  const {t} = useI18n();

  return (
    <section aria-live="polite" className={styles.root}>
      <div className={styles.header}>
        <h3 className={styles.title}>{t("contacts.safety.title")}</h3>
        <StatusPill
          label={t(`contacts.safety.level.${review.level}`)}
          tone={LEVEL_TONES[review.level]}
        />
      </div>
      <p className={styles.description}>{t("contacts.safety.description")}</p>
      {review.findings.length > 0 ? (
        <ul className={styles.findings}>
          {review.findings.map((finding) => (
            <li className={styles.finding} key={finding.code}>
              {t(FINDING_KEYS[finding.code as CommandRiskCode])}
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.description}>{t("contacts.safety.noFindings")}</p>
      )}
      {review.requiresAcknowledgement && onAcknowledgedChange ? (
        <label className={styles.acknowledgement}>
          <input
            checked={acknowledged}
            onChange={(event) => onAcknowledgedChange(event.target.checked)}
            type="checkbox"
          />
          <span>{t("contacts.safety.acknowledge")}</span>
        </label>
      ) : null}
    </section>
  );
}
