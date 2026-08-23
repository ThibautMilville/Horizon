import {useMutation} from "@apollo/client";
import {useCallback} from "react";

import type {MessageKey} from "@/shared/i18n/messages";
import {
  ContactDetailDocument,
  ContactListDocument,
  CreateContactDocument,
  MapContactPlannerDataDocument,
  UpdateContactDocument,
} from "@/shared/graphql";
import {buildContactMutationInput, type ContactInputError} from "@/shared/lib/contact-input";
import type {ContactFormValues} from "@/shared/lib/contact-form-values";
import {useI18n} from "@/shared/preferences/PreferencesProvider";

type ContactInputErrorMessage = {messageKey: MessageKey} | {fieldKey: MessageKey};

const CONTACT_INPUT_ERROR_MESSAGES: Record<ContactInputError, ContactInputErrorMessage> = {
  "configuration-object": {messageKey: "common.configMustBeObject"},
  "configuration-json": {messageKey: "common.configMustBeJson"},
  date: {messageKey: "common.invalidDate"},
  type: {fieldKey: "common.type"},
  "execution-script": {fieldKey: "common.executionScript"},
  "ground-station": {fieldKey: "common.groundStation"},
  satellite: {fieldKey: "common.satellite"},
  employee: {fieldKey: "common.operator"},
};

function contactInputErrorMessage(error: ContactInputError, t: ReturnType<typeof useI18n>["t"]) {
  const message = CONTACT_INPUT_ERROR_MESSAGES[error];
  if ("messageKey" in message) {
    return t(message.messageKey);
  }

  return t("common.requiredField", {field: t(message.fieldKey)});
}

export function useCreateContactMutation({
  refreshPlanner = false,
}: {refreshPlanner?: boolean} = {}) {
  const {t} = useI18n();
  const [createContact, state] = useMutation(CreateContactDocument, {
    refetchQueries: [
      {query: ContactListDocument},
      ...(refreshPlanner ? [{query: MapContactPlannerDataDocument}] : []),
    ],
    awaitRefetchQueries: refreshPlanner,
  });

  return {
    saving: state.loading,
    create: async (values: ContactFormValues) => {
      const input = buildContactMutationInput(values);
      if (!input.ok) {
        throw new Error(contactInputErrorMessage(input.error, t));
      }

      const result = await createContact({variables: input.value});
      return result.data?.createContact?.id;
    },
  };
}

export function useUpdateContact(id: string) {
  const {t} = useI18n();
  const [updateContact, state] = useMutation(UpdateContactDocument, {
    refetchQueries: [{query: ContactListDocument}, {query: ContactDetailDocument, variables: {id}}],
  });

  const save = useCallback(
    async (values: ContactFormValues) => {
      const input = buildContactMutationInput(values);
      if (!input.ok) {
        throw new Error(contactInputErrorMessage(input.error, t));
      }

      await updateContact({variables: {id, ...input.value}});
    },
    [id, t, updateContact],
  );

  return {saving: state.loading, save};
}
