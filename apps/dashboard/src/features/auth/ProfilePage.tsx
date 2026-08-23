import {formatSignedInAt, type SessionUser} from "@/features/auth/auth-credentials";
import {PreferenceControls} from "@/shared/preferences/PreferenceControls";
import {useI18n} from "@/shared/preferences/PreferencesProvider";
import {PageHeader} from "@/shared/ui/layout/PageHeader";
import {StatusPill} from "@/shared/ui/data-display/StatusPill";

import styles from "./ProfilePage.module.scss";

type ProfilePageProps = {
  user: SessionUser;
};

type ProfileRowProps = {
  icon: "user" | "at" | "mail" | "role" | "org" | "clock" | "login" | "shield";
  label: string;
  value: string;
};

export function ProfilePage({user}: ProfilePageProps) {
  const {t} = useI18n();

  const heroStats = [
    {id: "timezone", label: t("profile.timezone"), value: user.timezone},
    {id: "access", label: t("profile.access"), value: t("profile.accessValue")},
    {id: "signedIn", label: t("profile.signedIn"), value: formatSignedInAt(user.signedInAt)},
  ];

  const accountRows: ProfileRowProps[] = [
    {icon: "user", label: t("profile.displayName"), value: user.displayName},
    {icon: "at", label: t("profile.handle"), value: `@${user.handle}`},
    {icon: "mail", label: t("profile.email"), value: user.email},
    {icon: "role", label: t("profile.role"), value: user.role},
    {icon: "org", label: t("profile.organization"), value: user.organization},
  ];

  const sessionRows: ProfileRowProps[] = [
    {icon: "clock", label: t("profile.timezone"), value: user.timezone},
    {icon: "login", label: t("profile.signedIn"), value: formatSignedInAt(user.signedInAt)},
    {icon: "shield", label: t("profile.access"), value: t("profile.accessValue")},
  ];

  const consoleRows: ProfileRowProps[] = [
    {icon: "org", label: t("profile.product"), value: "Horizon"},
    {icon: "role", label: t("profile.mode"), value: t("profile.consoleMode")},
    {icon: "shield", label: t("profile.auth"), value: t("profile.authValue")},
  ];

  return (
    <>
      <PageHeader description={t("profile.description")} title={t("profile.title")} />
      <div className={styles.layout}>
        <section className={styles.hero}>
          <div className={styles["hero-main"]}>
            <span className={styles.avatar} aria-hidden="true">
              {user.avatarUrl ? (
                <img
                  alt=""
                  className={styles["avatar-image"]}
                  height={72}
                  src={user.avatarUrl}
                  width={72}
                />
              ) : (
                user.displayName.slice(0, 1)
              )}
            </span>
            <div className={styles["hero-copy"]}>
              <div className={styles["hero-title-row"]}>
                <h2 className={styles["hero-name"]}>{user.displayName}</h2>
                <StatusPill label={user.badge} tone="ok" />
              </div>
              <p className={styles["hero-handle"]}>@{user.handle}</p>
              <p className={styles["hero-meta"]}>
                {user.role} · {user.organization}
              </p>
            </div>
          </div>
          <div className={styles["hero-stats"]}>
            {heroStats.map((stat) => (
              <div className={styles.stat} key={stat.id}>
                <p className={styles["stat-label"]}>{stat.label}</p>
                <p className={styles["stat-value"]}>{stat.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.panel}>
          <h3 className={styles["panel-title"]}>{t("profile.preferences")}</h3>
          <div className={styles["prefs-grid"]}>
            <PreferenceControls
              fieldClassName={styles["pref-field"]}
              labelClassName={styles["pref-label"]}
              showLanguage
            />
          </div>
        </section>

        <div className={styles.columns}>
          <section className={styles.panel}>
            <h3 className={styles["panel-title"]}>{t("profile.account")}</h3>
            <ul className={styles.list}>
              {accountRows.map((row) => (
                <ProfileRow key={row.label} {...row} />
              ))}
            </ul>
          </section>

          <div className={styles["side-stack"]}>
            <section className={styles.panel}>
              <h3 className={styles["panel-title"]}>{t("profile.session")}</h3>
              <ul className={styles.list}>
                {sessionRows.map((row) => (
                  <ProfileRow key={row.label} {...row} />
                ))}
              </ul>
            </section>

            <section className={styles.panel}>
              <h3 className={styles["panel-title"]}>{t("profile.console")}</h3>
              <ul className={styles.list}>
                {consoleRows.map((row) => (
                  <ProfileRow key={row.label} {...row} />
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

function ProfileRow({icon, label, value}: ProfileRowProps) {
  return (
    <li className={styles.row}>
      <span className={styles["row-icon"]} aria-hidden="true">
        <ProfileIcon name={icon} />
      </span>
      <div className={styles["row-copy"]}>
        <p className={styles.label}>{label}</p>
        <p className={styles.value}>{value}</p>
      </div>
    </li>
  );
}

function ProfileIcon({name}: {name: ProfileRowProps["icon"]}) {
  switch (name) {
    case "user":
      return (
        <svg fill="none" height="16" viewBox="0 0 16 16" width="16">
          <circle cx="8" cy="5.4" r="2.2" stroke="currentColor" strokeWidth="1.3" />
          <path
            d="M3.4 13c.7-2.1 2.2-3.2 4.6-3.2s3.9 1.1 4.6 3.2"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.3"
          />
        </svg>
      );
    case "at":
      return (
        <svg fill="none" height="16" viewBox="0 0 16 16" width="16">
          <circle cx="8" cy="8" r="5.1" stroke="currentColor" strokeWidth="1.3" />
          <circle cx="8" cy="8" r="2.1" stroke="currentColor" strokeWidth="1.3" />
          <path d="M10.1 8v1.4a1.5 1.5 0 0 0 2.7.9" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      );
    case "mail":
      return (
        <svg fill="none" height="16" viewBox="0 0 16 16" width="16">
          <rect
            height="10"
            rx="1.2"
            stroke="currentColor"
            strokeWidth="1.3"
            width="12"
            x="2"
            y="3"
          />
          <path d="M3 4.2 8 8.2l5-4" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      );
    case "role":
      return (
        <svg fill="none" height="16" viewBox="0 0 16 16" width="16">
          <circle cx="8" cy="8" r="5.1" stroke="currentColor" strokeWidth="1.3" />
          <path
            d="M8 5.2v3.2l2 1.4"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.3"
          />
        </svg>
      );
    case "org":
      return (
        <svg fill="none" height="16" viewBox="0 0 16 16" width="16">
          <path
            d="M2.8 13.2V6.2L8 2.8l5.2 3.4v7"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="1.3"
          />
          <path d="M6.2 13.2V9h3.6v4.2" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      );
    case "clock":
      return (
        <svg fill="none" height="16" viewBox="0 0 16 16" width="16">
          <circle cx="8" cy="8" r="5.1" stroke="currentColor" strokeWidth="1.3" />
          <path
            d="M8 5v3.2l2.2 1.4"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.3"
          />
        </svg>
      );
    case "login":
      return (
        <svg fill="none" height="16" viewBox="0 0 16 16" width="16">
          <path
            d="M9.5 3H12a1.5 1.5 0 0 1 1.5 1.5v7A1.5 1.5 0 0 1 12 13H9.5"
            stroke="currentColor"
            strokeWidth="1.3"
          />
          <path
            d="M7 11.2 10.2 8 7 4.8M2.5 8h7.5"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.3"
          />
        </svg>
      );
    case "shield":
      return (
        <svg fill="none" height="16" viewBox="0 0 16 16" width="16">
          <path
            d="M8 2.4 12.4 4.2v3.4c0 2.7-1.8 4.7-4.4 5.8C5.4 12.3 3.6 10.3 3.6 7.6V4.2L8 2.4Z"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="1.3"
          />
        </svg>
      );
  }
}
