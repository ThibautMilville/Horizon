import {useCallback, useState} from "react";
import {useNavigate} from "react-router-dom";

import {useFormEntityOptions} from "@/shared/hooks/useFormEntityOptions";
import {useCommandSafetyState} from "@/shared/hooks/useCommandSafetyState";
import {useI18n} from "@/shared/preferences/PreferencesProvider";
import {emptyContactFormValues, type ContactFormValues} from "@/shared/lib/contact-form-values";
import {useToast} from "@/shared/ui/feedback/ToastProvider";

import {useCreateContactMutation} from "./useContactMutations";

export function useContactFormOptions(satelliteId: string) {
  return useFormEntityOptions(satelliteId);
}

export function useCreateContact() {
  const navigate = useNavigate();
  const toast = useToast();
  const {t} = useI18n();
  const {create, saving} = useCreateContactMutation();

  return {
    saving,
    submit: async (values: ContactFormValues) => {
      const id = await create(values);
      if (id) {
        toast.success(t("contacts.scheduled"));
        navigate(`/contacts/${id}`);
      }
    },
  };
}

export function useContactCreate() {
  const {t} = useI18n();
  const [values, setValues] = useState<ContactFormValues>(emptyContactFormValues);
  const [formError, setFormError] = useState<string | undefined>();
  const options = useContactFormOptions(values.satellite_id);
  const create = useCreateContact();
  const {safety, safetyAcknowledged, setSafetyAcknowledged, onScriptOrConfigChange} =
    useCommandSafetyState(values.executionScript, values.configurationText);

  const updateValues = useCallback(
    (nextValues: ContactFormValues) => {
      setValues((current) => {
        onScriptOrConfigChange(nextValues, current);
        return nextValues;
      });
    },
    [onScriptOrConfigChange],
  );

  const submit = useCallback(() => {
    setFormError(undefined);
    void create.submit(values).catch((error: unknown) => {
      setFormError(error instanceof Error ? error.message : t("contacts.saveFailed"));
    });
  }, [create, t, values]);

  return {
    values,
    formError,
    safety,
    safetyAcknowledged,
    loading: options.loading,
    saving: create.saving,
    errorMessage: options.errorMessage,
    satellites: options.satellites,
    stations: options.stations,
    employees: options.employees,
    payloads: options.payloads,
    setValues: updateValues,
    setSafetyAcknowledged,
    submit,
    retry: options.retry,
  };
}
