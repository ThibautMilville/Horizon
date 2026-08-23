import {useCallback, useEffect, useRef, useState, type SetStateAction} from "react";

import {useCommandSafetyState} from "@/shared/hooks/useCommandSafetyState";
import {useI18n} from "@/shared/preferences/PreferencesProvider";
import {
  contactFormSignature,
  contactToFormValues,
  emptyContactFormValues,
  type ContactFormValues,
} from "@/shared/lib/contact-form-values";
import {useToast} from "@/shared/ui/feedback/ToastProvider";

import {useContactAutosave} from "./useContactAutosave";
import {useContactDetail} from "./useContactDetail";
import {useContactFormOptions} from "./useContactForm";
import {useUpdateContact} from "./useContactMutations";

export function useContactEditor(id: string) {
  const toast = useToast();
  const {t} = useI18n();
  const detail = useContactDetail(id);
  const [values, setValues] = useState<ContactFormValues>(emptyContactFormValues);
  const [hydrated, setHydrated] = useState(false);
  const [baseline, setBaseline] = useState("");
  const options = useContactFormOptions(values.satellite_id);
  const {save, saving} = useUpdateContact(id);
  const valuesRef = useRef(values);
  const saveGeneration = useRef(0);
  valuesRef.current = values;

  const {
    safety,
    safetyAcknowledged,
    setSafetyAcknowledged,
    safetyBlocked,
    onScriptOrConfigChange,
    resetSafetyAcknowledgement,
  } = useCommandSafetyState(values.executionScript, values.configurationText);

  useContactAutosave({
    id,
    values,
    baseline,
    hydrated,
    safetyBlocked,
    safetyAcknowledged,
    saveGeneration,
    save,
    setBaseline,
    onSaved: () => toast.success(t("contacts.saved")),
    onSaveFailed: (message) => toast.error(message || t("contacts.saveFailed")),
  });

  useEffect(() => {
    saveGeneration.current += 1;
    setValues(emptyContactFormValues);
    setBaseline("");
    setHydrated(false);
    resetSafetyAcknowledgement();
  }, [id, resetSafetyAcknowledgement]);

  useEffect(() => {
    const contact = detail.contact;
    if (!(contact?.id && contact.id === id && !hydrated) || !contact) {
      return;
    }

    const next = contactToFormValues(contact);
    setValues(next);
    setBaseline(contactFormSignature(next));
    setHydrated(true);
    resetSafetyAcknowledgement();
  }, [detail.contact, hydrated, id, resetSafetyAcknowledgement]);

  const updateValues = useCallback(
    (action: SetStateAction<ContactFormValues>) => {
      const nextValues = typeof action === "function" ? action(valuesRef.current) : action;
      setValues((current) => {
        onScriptOrConfigChange(nextValues, current);
        return nextValues;
      });
    },
    [onScriptOrConfigChange],
  );

  return {
    loading: detail.loading || options.loading || (detail.contact?.id === id && !hydrated),
    saving,
    errorMessage: detail.errorMessage ?? options.errorMessage,
    contact: detail.contact,
    values,
    setValues: updateValues,
    safety,
    safetyAcknowledged,
    setSafetyAcknowledged,
    safetyBlocked,
    satellites: options.satellites,
    stations: options.stations,
    employees: options.employees,
    payloads: options.payloads,
    retry: () => {
      detail.retry();
      options.retry();
    },
  };
}
