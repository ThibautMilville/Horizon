import {useCallback, useEffect, useRef, type MutableRefObject} from "react";

import {isApolloRequestError} from "@/shared/lib/apollo-error-policy";
import {contactFormSignature, type ContactFormValues} from "@/shared/lib/contact-form-values";
import {reviewCommandSafety} from "@/shared/lib/command-safety";

const AUTOSAVE_MS = 750;

type UseContactAutosaveArgs = {
  id: string;
  values: ContactFormValues;
  baseline: string;
  hydrated: boolean;
  safetyBlocked: boolean;
  safetyAcknowledged: boolean;
  saveGeneration: MutableRefObject<number>;
  save: (values: ContactFormValues) => Promise<void>;
  setBaseline: (signature: string) => void;
  onSaved: () => void;
  onSaveFailed: (message: string) => void;
};

export function useContactAutosave({
  id,
  values,
  baseline,
  hydrated,
  safetyBlocked,
  safetyAcknowledged,
  saveGeneration,
  save,
  setBaseline,
  onSaved,
  onSaveFailed,
}: UseContactAutosaveArgs) {
  const valuesRef = useRef(values);
  const baselineRef = useRef(baseline);
  const hydratedRef = useRef(hydrated);
  const safetyAcknowledgedRef = useRef(safetyAcknowledged);
  const queuedSaveRef = useRef("");
  const timerRef = useRef<number | null>(null);
  const saveChainRef = useRef(Promise.resolve());
  const saveRef = useRef(save);
  const onSavedRef = useRef(onSaved);
  const onSaveFailedRef = useRef(onSaveFailed);
  valuesRef.current = values;
  baselineRef.current = baseline;
  hydratedRef.current = hydrated;
  safetyAcknowledgedRef.current = safetyAcknowledged;
  saveRef.current = save;
  onSavedRef.current = onSaved;
  onSaveFailedRef.current = onSaveFailed;

  const runSave = useCallback(
    (
      activeSave: (values: ContactFormValues) => Promise<void>,
      nextValues: ContactFormValues,
      generation: number,
      announce: boolean,
    ) => {
      const signature = contactFormSignature(nextValues);
      const saveKey = `${generation}:${signature}`;
      if (queuedSaveRef.current === saveKey) {
        return;
      }
      queuedSaveRef.current = saveKey;
      saveChainRef.current = saveChainRef.current
        .catch(() => undefined)
        .then(async () => {
          await activeSave(nextValues);
          if (saveGeneration.current !== generation) {
            return;
          }
          setBaseline(signature);
          if (announce) {
            onSavedRef.current();
          }
        })
        .catch((error: unknown) => {
          if (saveGeneration.current !== generation) {
            return;
          }
          if (announce && !isApolloRequestError(error)) {
            onSaveFailedRef.current(error instanceof Error ? error.message : "");
          }
        })
        .finally(() => {
          if (queuedSaveRef.current === saveKey) {
            queuedSaveRef.current = "";
          }
        });
    },
    [saveGeneration, setBaseline],
  );

  const runSaveRef = useRef(runSave);
  runSaveRef.current = runSave;

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      const pendingValues = valuesRef.current;
      const pendingSafety = reviewCommandSafety(
        pendingValues.executionScript,
        pendingValues.configurationText,
      );
      const unsafeSaveBlocked =
        pendingSafety.requiresAcknowledgement && !safetyAcknowledgedRef.current;
      if (
        hydratedRef.current &&
        !unsafeSaveBlocked &&
        contactFormSignature(pendingValues) !== baselineRef.current
      ) {
        runSaveRef.current(saveRef.current, pendingValues, saveGeneration.current, false);
      }

      saveGeneration.current += 1;
    };
  }, [id, saveGeneration]);

  useEffect(() => {
    if (!hydrated || safetyBlocked) {
      return;
    }

    if (contactFormSignature(values) === baseline) {
      return;
    }

    const generation = saveGeneration.current;
    const pendingValues = values;
    const activeSave = save;

    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      runSaveRef.current(activeSave, pendingValues, generation, true);
    }, AUTOSAVE_MS);

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [baseline, hydrated, safetyBlocked, save, saveGeneration, values]);
}
