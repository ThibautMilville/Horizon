import {useContactCreate} from "./useContactForm";
import {ContactFormPage} from "./ContactFormPage";
import {useI18n} from "@/shared/preferences/PreferencesProvider";

export function ContactCreateRoute() {
  const {t} = useI18n();
  const editor = useContactCreate();

  return (
    <ContactFormPage
      cancelTo="/contacts"
      employees={editor.employees}
      errorMessage={editor.errorMessage}
      formError={editor.formError}
      loading={editor.loading}
      onChange={editor.setValues}
      onRetry={editor.retry}
      onSafetyAcknowledgedChange={editor.setSafetyAcknowledged}
      onSubmit={editor.submit}
      payloads={editor.payloads}
      satellites={editor.satellites}
      saving={editor.saving}
      safety={editor.safety}
      safetyAcknowledged={editor.safetyAcknowledged}
      stations={editor.stations}
      title={t("contacts.schedule")}
      values={editor.values}
    />
  );
}
