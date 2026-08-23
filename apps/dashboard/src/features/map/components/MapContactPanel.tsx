import {useEffect, useState} from "react";

import {CommandSafetyReview} from "@/features/contacts/CommandSafetyReview";
import {ContactFields} from "@/features/contacts/ContactFields";
import type {useMapPanelDrag} from "@/features/map/hooks/useMapPanelDrag";
import type {SatellitePass} from "@/features/map/lib/satellite-pass";
import {formatUtcDateTime} from "@/shared/lib/datetime-local";
import type {CommandSafetyAssessment} from "@/shared/lib/command-safety";
import type {ContactFormValues} from "@/shared/lib/contact-form-values";
import {useI18n} from "@/shared/preferences/PreferencesProvider";
import {CloseIcon, ChevronDownIcon, ScheduleIcon} from "@/shared/ui/actions/action-icons";
import {Button} from "@/shared/ui/actions/Button";
import {StatusPill} from "@/shared/ui/data-display/StatusPill";
import formStyles from "@/shared/ui/forms/form.module.scss";
import type {NamedEntity} from "@/shared/types/entities";

import styles from "./MapContactPanel.module.scss";

type MapContactPanelProps = {
  open: boolean;
  values: ContactFormValues;
  formError?: string | null;
  saving: boolean;
  selectedLabel?: string;
  satellites: NamedEntity[];
  stations: NamedEntity[];
  employees: NamedEntity[];
  payloads: NamedEntity[];
  passOpportunities: SatellitePass[];
  safety: CommandSafetyAssessment;
  safetyAcknowledged: boolean;
  optionsLoading: boolean;
  drag: ReturnType<typeof useMapPanelDrag>;
  onClose: () => void;
  onChange: <K extends keyof ContactFormValues>(key: K, value: ContactFormValues[K]) => void;
  onSubmit: () => void;
  onSelectPass: (pass: SatellitePass) => void;
  onSafetyAcknowledgedChange: (acknowledged: boolean) => void;
};

const PASS_PREVIEW_COUNT = 5;

function applyContactValues(
  current: ContactFormValues,
  next: ContactFormValues,
  onChange: MapContactPanelProps["onChange"],
) {
  (Object.keys(next) as Array<keyof ContactFormValues>).forEach((key) => {
    if (next[key] !== current[key]) {
      onChange(key, next[key]);
    }
  });
}

export function MapContactPanel({
  open,
  values,
  formError,
  saving,
  selectedLabel,
  satellites,
  stations,
  employees,
  payloads,
  passOpportunities,
  safety,
  safetyAcknowledged,
  optionsLoading,
  drag,
  onClose,
  onChange,
  onSubmit,
  onSelectPass,
  onSafetyAcknowledgedChange,
}: MapContactPanelProps) {
  const {t, language} = useI18n();
  const [showAllPasses, setShowAllPasses] = useState(false);
  const safetyBlocked = safety.requiresAcknowledgement && !safetyAcknowledged;
  const hiddenPassCount = Math.max(0, passOpportunities.length - PASS_PREVIEW_COUNT);
  const visiblePasses = showAllPasses
    ? passOpportunities
    : passOpportunities.slice(0, PASS_PREVIEW_COUNT);

  useEffect(() => {
    setShowAllPasses(false);
  }, [open, values.satellite_id]);

  if (!open) {
    return null;
  }

  return (
    <aside
      aria-label={t("map.plannerTitle")}
      className={`${styles.panel} ${drag.mobile ? styles.mobile : ""} ${drag.dragging ? styles.dragging : ""}`}
      ref={drag.panelRef}
      style={drag.style}
    >
      <header
        className={`${styles.head} ${drag.mobile ? "" : styles["head-drag"]}`}
        {...(drag.mobile ? {} : drag.dragHandleProps)}
      >
        <div className={styles["head-copy"]}>
          {drag.mobile ? <span aria-hidden="true" className={styles["mobile-handle"]} /> : null}
          <div>
            <p className={styles.eyebrow}>{t("map.plannerEyebrow")}</p>
            <h2 className={styles.title}>{t("map.plannerTitle")}</h2>
            {selectedLabel ? <p className={styles.context}>{selectedLabel}</p> : null}
          </div>
        </div>
        <button
          aria-label={t("map.closePlannerAria")}
          className={styles.close}
          onClick={onClose}
          type="button"
        >
          <CloseIcon size={14} />
        </button>
      </header>

      <div className={styles.body}>
        <p className={styles.lead}>{t("map.plannerLead")}</p>

        <section className={styles.passes}>
          <div className={styles["section-heading"]}>
            <h3>{t("map.passOpportunities")}</h3>
            <span>{t("map.next24Hours")}</span>
          </div>
          {!values.satellite_id ? (
            <p className={styles.lead}>{t("map.selectSatelliteForPasses")}</p>
          ) : passOpportunities.length === 0 ? (
            <p className={styles.lead}>{t("map.noPassOpportunities")}</p>
          ) : (
            <div className={styles["pass-list"]}>
              {visiblePasses.map((pass) => (
                <button
                  className={styles.pass}
                  key={`${pass.stationId}:${pass.aos}`}
                  onClick={() => onSelectPass(pass)}
                  type="button"
                >
                  <span className={styles["pass-copy"]}>
                    <strong>{pass.stationName}</strong>
                    <small>
                      {formatUtcDateTime(pass.aos, language)} · {pass.durationMinutes} min ·{" "}
                      {pass.maxElevationDegrees}°
                    </small>
                  </span>
                  <StatusPill
                    label={
                      pass.conflict
                        ? t("map.passConflict")
                        : pass.recommended
                          ? t("map.passRecommended")
                          : (pass.stationStatus ?? t("common.unknown"))
                    }
                    tone={pass.conflict ? "danger" : pass.recommended ? "ok" : "warn"}
                  />
                </button>
              ))}
              {hiddenPassCount > 0 && !showAllPasses ? (
                <button
                  className={styles["show-more"]}
                  onClick={() => setShowAllPasses(true)}
                  type="button"
                >
                  {t("map.showMorePasses", {count: String(hiddenPassCount)})}
                  <ChevronDownIcon size={14} />
                </button>
              ) : null}
            </div>
          )}
        </section>

        <div className={formStyles.form}>
          <ContactFields
            employees={employees}
            layout="map"
            onChange={(next) => applyContactValues(values, next, onChange)}
            optionsLoading={optionsLoading}
            payloads={payloads}
            satellites={satellites}
            stations={stations}
            values={values}
          />
        </div>

        <CommandSafetyReview
          acknowledged={safetyAcknowledged}
          onAcknowledgedChange={onSafetyAcknowledgedChange}
          review={safety}
        />

        {formError ? <p className={styles.error}>{formError}</p> : null}
      </div>

      <footer className={styles.footer}>
        <Button onClick={onClose} type="button" variant="secondary">
          {t("common.cancel")}
        </Button>
        <Button
          disabled={saving || safetyBlocked}
          onClick={() => void onSubmit()}
          type="button"
          variant="primary"
        >
          {saving ? (
            t("common.scheduling")
          ) : (
            <>
              <ScheduleIcon />
              {t("common.schedule")}
            </>
          )}
        </Button>
      </footer>
    </aside>
  );
}
