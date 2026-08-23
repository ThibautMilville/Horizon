import {useState, type FormEvent} from "react";
import {Navigate} from "react-router-dom";

import {useI18n} from "@/shared/preferences/PreferencesProvider";
import {ArrowLeftIcon} from "@/shared/ui/actions/action-icons";
import {Button} from "@/shared/ui/actions/Button";
import {BrandMark} from "@/shared/ui/actions/BrandMark";
import {Input} from "@/shared/ui/forms/Input";
import {TextLink} from "@/shared/ui/navigation/TextLink";
import {useToast} from "@/shared/ui/feedback/ToastProvider";

import {useAuth} from "./AuthProvider";

import styles from "./LoginPage.module.scss";

export function ForgotPasswordPage() {
  const {user} = useAuth();
  const toast = useToast();
  const {t} = useI18n();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (user) {
    return <Navigate replace to="/map" />;
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextEmail = email.trim();
    if (!nextEmail) {
      toast.error(t("forgot.missingEmail"));
      return;
    }

    if (!nextEmail.includes("@")) {
      toast.error(t("forgot.invalidEmail"));
      return;
    }

    setSubmitted(true);
    toast.success(t("forgot.sent"));
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
        <h1 className={styles.title}>{t("forgot.title")}</h1>
        <p className={styles.lead}>{t("forgot.lead")}</p>
        <label className={styles.field}>
          <span className={styles.label}>{t("forgot.email")}</span>
          <Input
            autoComplete="email"
            onChange={(event) => {
              setEmail(event.target.value);
              setSubmitted(false);
            }}
            placeholder="commander@horizon.ops"
            required
            tone="soft"
            type="email"
            value={email}
          />
        </label>
        {submitted ? <p className={styles.lead}>{t("forgot.sent")}</p> : null}
        <Button type="submit">{t("forgot.submit")}</Button>
        <p className={styles.footer}>
          <TextLink to="/login">
            <span className={styles["footer-link"]}>
              <ArrowLeftIcon />
              {t("forgot.back")}
            </span>
          </TextLink>
        </p>
      </form>
    </div>
  );
}
