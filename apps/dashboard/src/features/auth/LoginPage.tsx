import {useState, type FormEvent} from "react";
import {Navigate, useLocation, useNavigate} from "react-router-dom";

import {useI18n} from "@/shared/preferences/PreferencesProvider";
import {MAP_PATH} from "@/shared/lib/map-href";
import {Button} from "@/shared/ui/actions/Button";
import {BrandMark} from "@/shared/ui/actions/BrandMark";
import {Input} from "@/shared/ui/forms/Input";
import {TextLink} from "@/shared/ui/navigation/TextLink";
import {useToast} from "@/shared/ui/feedback/ToastProvider";

import {useAuth} from "./AuthProvider";

import styles from "./LoginPage.module.scss";

export function LoginPage() {
  const {user, signIn} = useAuth();
  const toast = useToast();
  const {t} = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const from =
    typeof location.state === "object" &&
    location.state &&
    "from" in location.state &&
    typeof (location.state as {from?: unknown}).from === "string"
      ? (location.state as {from: string}).from
      : MAP_PATH;

  if (user) {
    const destination = from === "/login" || from === "/" ? MAP_PATH : from;
    return <Navigate replace to={destination} />;
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextUsername = username.trim();
    if (!nextUsername || !password) {
      const message = t("login.missingFields");
      setErrorMessage(message);
      toast.error(message);
      return;
    }

    const ok = signIn(nextUsername, password);
    if (!ok) {
      const message = t("login.invalid");
      setErrorMessage(message);
      toast.error(message);
      return;
    }

    setErrorMessage(null);
    toast.success(t("login.welcome", {name: nextUsername}));
    navigate(from === "/login" ? "/" : from, {replace: true});
  };

  return (
    <div className={styles.page}>
      <form className={styles.card} onSubmit={onSubmit}>
        <div className={styles.brand}>
          <span className={styles["brand-mark"]} aria-hidden="true">
            <BrandMark />
          </span>
          <div>
            <p className={styles["brand-name"]}>Horizon</p>
            <p className={styles["brand-tag"]}>{t("login.brandTag")}</p>
          </div>
        </div>
        <h1 className={styles.title}>{t("login.title")}</h1>
        <p className={styles.lead}>{t("login.lead")}</p>
        <label className={styles.field}>
          <span className={styles.label}>{t("login.username")}</span>
          <Input
            autoComplete="username"
            id="horizon-login-username"
            name="username"
            onChange={(event) => {
              setUsername(event.target.value);
              setErrorMessage(null);
            }}
            placeholder="Commander"
            tone="soft"
            value={username}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>{t("login.password")}</span>
          <div className={styles["password-field"]}>
            <Input
              autoComplete="current-password"
              className={styles["password-input"]}
              id="horizon-login-password"
              name="password"
              onChange={(event) => {
                setPassword(event.target.value);
                setErrorMessage(null);
              }}
              placeholder="••••••••"
              tone="soft"
              type={showPassword ? "text" : "password"}
              value={password}
            />
            <button
              aria-label={showPassword ? t("login.hidePassword") : t("login.showPassword")}
              className={styles["password-toggle"]}
              onClick={() => setShowPassword((current) => !current)}
              type="button"
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </label>
        {errorMessage ? <p className={styles.error}>{errorMessage}</p> : null}
        <Button type="submit">{t("login.continue")}</Button>
        <p className={styles.footer}>
          <TextLink to="/login/forgot">{t("login.forgot")}</TextLink>
        </p>
      </form>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16">
      <path
        d="M1.6 8s2.4-4.2 6.4-4.2S14.4 8 14.4 8s-2.4 4.2-6.4 4.2S1.6 8 1.6 8Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.3"
      />
      <circle cx="8" cy="8" r="2.1" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16">
      <path
        d="M2 2.4 13.6 14M6.7 6.8A2.1 2.1 0 0 0 9.2 9.3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.3"
      />
      <path
        d="M4.1 4.5C2.6 5.5 1.6 8 1.6 8s2.4 4.2 6.4 4.2c1.1 0 2.1-.3 3-.8M7.1 3.9c.3 0 .6-.1.9-.1 4 0 6.4 4.2 6.4 4.2s-.5 1-1.5 2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.3"
      />
    </svg>
  );
}
