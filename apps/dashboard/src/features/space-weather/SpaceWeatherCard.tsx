import {formatUtcDateTime} from "@/shared/lib/datetime-local";
import {useI18n} from "@/shared/preferences/PreferencesProvider";
import {Button} from "@/shared/ui/actions/Button";
import {Card} from "@/shared/ui/data-display/Card";
import {StatusPill, type StatusTone} from "@/shared/ui/data-display/StatusPill";

import {NOAA_KP_SOURCE, formatPlanetaryKp, type SpaceWeatherLevel} from "./space-weather";
import {useSpaceWeather} from "./useSpaceWeather";

import styles from "./SpaceWeatherCard.module.scss";

const LEVEL_TONES: Record<SpaceWeatherLevel, StatusTone> = {
  quiet: "ok",
  active: "warn",
  storm: "danger",
};

export function SpaceWeatherCard() {
  const {t, language} = useI18n();
  const weather = useSpaceWeather();

  return (
    <Card info={t("spaceWeather.info")} title={t("spaceWeather.title")}>
      {weather.observation ? (
        <div className={styles.content}>
          <div className={styles.value}>
            {formatPlanetaryKp(weather.observation.kp)} <small>Kp</small>
          </div>
          <div className={styles.copy}>
            <StatusPill
              label={
                weather.observation.scale
                  ? `${weather.observation.scale} · ${t(`spaceWeather.level.${weather.observation.level}`)}`
                  : t(`spaceWeather.level.${weather.observation.level}`)
              }
              tone={LEVEL_TONES[weather.observation.level]}
            />
            <div className={styles.meta}>
              <span className={styles.observed}>
                {t("spaceWeather.observed", {
                  date: formatUtcDateTime(weather.observation.observedAt, language),
                })}
              </span>
              <span className={styles.rule} />
              <a className={styles.source} href={NOAA_KP_SOURCE} rel="noreferrer" target="_blank">
                {t("spaceWeather.source")}
                <svg
                  aria-hidden="true"
                  className={styles["source-icon"]}
                  fill="none"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M4.6 11.4 11.4 4.6M7 4.6h4.4V9"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                </svg>
              </a>
            </div>
            {weather.errorMessage ? (
              <p className={styles.stale}>{t("spaceWeather.stale")}</p>
            ) : null}
          </div>
        </div>
      ) : weather.loading ? (
        <p>{t("common.loading")}</p>
      ) : (
        <div className={styles.error}>
          <p>{t("spaceWeather.unavailable")}</p>
          <Button onClick={weather.retry} variant="secondary">
            {t("common.retry")}
          </Button>
        </div>
      )}
    </Card>
  );
}
