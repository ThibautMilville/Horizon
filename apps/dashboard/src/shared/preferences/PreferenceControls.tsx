import {languageSelectOptions} from "@/shared/i18n/language-options";
import {Select, type SelectOption} from "@/shared/ui/forms/Select";

import {usePreferences} from "./PreferencesProvider";
import {
  isHorizonLanguage,
  isHorizonMotion,
  isHorizonTextScale,
  isHorizonTheme,
} from "./preferences";

type PreferenceControlsProps = {
  fieldClassName: string;
  labelClassName: string;
  showLanguage?: boolean;
};

type PreferenceField = {
  id: string;
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
};

export function PreferenceControls({
  fieldClassName,
  labelClassName,
  showLanguage = false,
}: PreferenceControlsProps) {
  const {t, language, theme, textScale, motion, setLanguage, setTheme, setTextScale, setMotion} =
    usePreferences();

  const fields: PreferenceField[] = [
    ...(showLanguage
      ? [
          {
            id: "language",
            label: t("prefs.language"),
            value: language,
            options: languageSelectOptions(t),
            onChange: (value: string) => {
              if (isHorizonLanguage(value)) {
                setLanguage(value);
              }
            },
          },
        ]
      : []),
    {
      id: "theme",
      label: t("prefs.appearance"),
      value: theme,
      options: [
        {value: "dark", label: t("prefs.themeDark")},
        {value: "light", label: t("prefs.themeLight")},
        {value: "contrast", label: t("prefs.themeContrast")},
      ],
      onChange: (value) => {
        if (isHorizonTheme(value)) {
          setTheme(value);
        }
      },
    },
    {
      id: "textScale",
      label: t("prefs.textSize"),
      value: textScale,
      options: [
        {value: "sm", label: t("prefs.textSm")},
        {value: "md", label: t("prefs.textMd")},
        {value: "lg", label: t("prefs.textLg")},
      ],
      onChange: (value) => {
        if (isHorizonTextScale(value)) {
          setTextScale(value);
        }
      },
    },
    {
      id: "motion",
      label: t("prefs.motion"),
      value: motion,
      options: [
        {value: "on", label: t("prefs.motionOn")},
        {value: "off", label: t("prefs.motionOff")},
      ],
      onChange: (value) => {
        if (isHorizonMotion(value)) {
          setMotion(value);
        }
      },
    },
  ];

  return (
    <>
      {fields.map((field) => (
        <label className={fieldClassName} key={field.id}>
          <span className={labelClassName}>{field.label}</span>
          <Select
            aria-label={field.label}
            onChange={field.onChange}
            options={field.options}
            value={field.value}
          />
        </label>
      ))}
    </>
  );
}
