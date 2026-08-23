import {usePreferences} from "@/shared/preferences/PreferencesProvider";
import {languageSelectOptions} from "@/shared/i18n/language-options";
import {isHorizonLanguage} from "@/shared/preferences/preferences";
import {Select} from "@/shared/ui/forms/Select";
import {Tooltip} from "@/shared/ui/overlays/Tooltip";

import styles from "./ShellLanguageSelect.module.scss";

type ShellLanguageSelectProps = {
  collapsed: boolean;
};

export function ShellLanguageSelect({collapsed}: ShellLanguageSelectProps) {
  const {language, setLanguage, t} = usePreferences();

  const control = (
    <Select
      aria-label={t("prefs.language")}
      onChange={(value) => {
        if (isHorizonLanguage(value)) {
          setLanguage(value);
        }
      }}
      options={languageSelectOptions(t, collapsed)}
      value={language}
    />
  );

  return (
    <div className={`${styles.root} ${collapsed ? styles.collapsed : ""}`}>
      {collapsed ? null : <p className={styles.label}>{t("prefs.language")}</p>}
      {collapsed ? (
        <Tooltip content={t("prefs.language")} position="right">
          {control}
        </Tooltip>
      ) : (
        control
      )}
    </div>
  );
}
