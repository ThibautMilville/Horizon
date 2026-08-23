import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {useToast} from "@/shared/ui/feedback/ToastProvider";
import {translate, type MessageKey} from "@/shared/i18n/messages";

import {
  applyPreferencesToDocument,
  readPreferences,
  writePreferences,
  type HorizonLanguage,
  type HorizonMotion,
  type HorizonPreferences,
  type HorizonTextScale,
  type HorizonTheme,
} from "./preferences";

type PreferencesContextValue = {
  language: HorizonLanguage;
  theme: HorizonTheme;
  textScale: HorizonTextScale;
  motion: HorizonMotion;
  setLanguage: (language: HorizonLanguage) => void;
  setTheme: (theme: HorizonTheme) => void;
  setTextScale: (textScale: HorizonTextScale) => void;
  setMotion: (motion: HorizonMotion) => void;
  t: (key: MessageKey, vars?: Record<string, string>) => string;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

type PreferencesProviderProps = {
  children: ReactNode;
};

function preferenceChangeToast(
  language: HorizonLanguage,
  toastKey: MessageKey,
  valueKey: MessageKey,
): string {
  return `${translate(language, toastKey)}: ${translate(language, valueKey)}`;
}

export function PreferencesProvider({children}: PreferencesProviderProps) {
  const toast = useToast();
  const [prefs, setPrefs] = useState<HorizonPreferences>(() => {
    const initial = readPreferences();
    applyPreferencesToDocument(initial);
    return initial;
  });

  useEffect(() => {
    applyPreferencesToDocument(prefs);
    writePreferences(prefs);
  }, [prefs]);

  const setLanguage = useCallback(
    (language: HorizonLanguage) => {
      setPrefs((current) => ({...current, language}));
      toast.success(
        preferenceChangeToast(
          language,
          "prefs.toastLanguage",
          language === "fr" ? "prefs.languageFr" : "prefs.languageEn",
        ),
      );
    },
    [toast],
  );

  const setTheme = useCallback(
    (theme: HorizonTheme) => {
      setPrefs((current) => ({...current, theme}));
      const themeKey =
        theme === "light"
          ? "prefs.themeLight"
          : theme === "contrast"
            ? "prefs.themeContrast"
            : "prefs.themeDark";
      toast.success(preferenceChangeToast(prefs.language, "prefs.toastTheme", themeKey));
    },
    [prefs.language, toast],
  );

  const setTextScale = useCallback(
    (textScale: HorizonTextScale) => {
      setPrefs((current) => ({...current, textScale}));
      const scaleKey =
        textScale === "sm" ? "prefs.textSm" : textScale === "lg" ? "prefs.textLg" : "prefs.textMd";
      toast.success(preferenceChangeToast(prefs.language, "prefs.toastText", scaleKey));
    },
    [prefs.language, toast],
  );

  const setMotion = useCallback(
    (motion: HorizonMotion) => {
      setPrefs((current) => ({...current, motion}));
      const motionKey = motion === "off" ? "prefs.motionOff" : "prefs.motionOn";
      toast.success(preferenceChangeToast(prefs.language, "prefs.toastMotion", motionKey));
    },
    [prefs.language, toast],
  );

  const t = useCallback(
    (key: MessageKey, vars?: Record<string, string>) => translate(prefs.language, key, vars),
    [prefs.language],
  );

  const value = useMemo(
    () => ({
      language: prefs.language,
      theme: prefs.theme,
      textScale: prefs.textScale,
      motion: prefs.motion,
      setLanguage,
      setTheme,
      setTextScale,
      setMotion,
      t,
    }),
    [
      prefs.language,
      prefs.theme,
      prefs.textScale,
      prefs.motion,
      setLanguage,
      setTheme,
      setTextScale,
      setMotion,
      t,
    ],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences(): PreferencesContextValue {
  const value = useContext(PreferencesContext);
  if (!value) {
    throw new Error("usePreferences must be used within PreferencesProvider");
  }
  return value;
}

export function useI18n() {
  const {t, language} = usePreferences();
  return {t, language};
}
