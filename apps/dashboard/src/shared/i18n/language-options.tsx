import type {ReactNode} from "react";

import type {HorizonLanguage} from "@/shared/preferences/preferences";

import type {MessageKey} from "./messages";

type Translate = (key: MessageKey) => string;

type LanguageOption = {
  value: HorizonLanguage;
  label: string;
  leading: ReactNode;
};

function UsFlagIcon() {
  return (
    <svg aria-hidden="true" height="14" viewBox="0 0 22 16" width="20">
      <rect fill="#b22234" height="16" width="22" />
      <path
        d="M0 1.85h22M0 4.3h22M0 6.75h22M0 9.2h22M0 11.65h22M0 14.1h22"
        stroke="#fff"
        strokeWidth="1.35"
      />
      <rect fill="#3c3b6e" height="8.55" width="9.2" />
      <g fill="#fff">
        <circle cx="1.6" cy="1.5" r="0.45" />
        <circle cx="3.5" cy="1.5" r="0.45" />
        <circle cx="5.4" cy="1.5" r="0.45" />
        <circle cx="7.3" cy="1.5" r="0.45" />
        <circle cx="2.55" cy="2.9" r="0.45" />
        <circle cx="4.45" cy="2.9" r="0.45" />
        <circle cx="6.35" cy="2.9" r="0.45" />
        <circle cx="1.6" cy="4.3" r="0.45" />
        <circle cx="3.5" cy="4.3" r="0.45" />
        <circle cx="5.4" cy="4.3" r="0.45" />
        <circle cx="7.3" cy="4.3" r="0.45" />
        <circle cx="2.55" cy="5.7" r="0.45" />
        <circle cx="4.45" cy="5.7" r="0.45" />
        <circle cx="6.35" cy="5.7" r="0.45" />
        <circle cx="1.6" cy="7.1" r="0.45" />
        <circle cx="3.5" cy="7.1" r="0.45" />
        <circle cx="5.4" cy="7.1" r="0.45" />
        <circle cx="7.3" cy="7.1" r="0.45" />
      </g>
    </svg>
  );
}

function FrFlagIcon() {
  return (
    <svg aria-hidden="true" height="14" viewBox="0 0 22 16" width="20">
      <rect fill="#0055a4" height="16" width="7.34" />
      <rect fill="#fff" height="16" width="7.34" x="7.33" />
      <rect fill="#ef4135" height="16" width="7.34" x="14.66" />
    </svg>
  );
}

export function languageSelectOptions(t: Translate, compact = false): LanguageOption[] {
  return [
    {
      value: "en",
      label: compact ? "EN" : t("prefs.languageEn"),
      leading: <UsFlagIcon />,
    },
    {
      value: "fr",
      label: compact ? "FR" : t("prefs.languageFr"),
      leading: <FrFlagIcon />,
    },
  ];
}
