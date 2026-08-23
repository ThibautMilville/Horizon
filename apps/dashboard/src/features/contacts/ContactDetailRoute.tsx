import {useParams} from "react-router-dom";

import {FullPageState} from "@/shared/ui/layout/FullPageState";

import {ContactDetailPage} from "./ContactDetailPage";
import {useContactEditor} from "./useContactEditor";
import {useI18n} from "@/shared/preferences/PreferencesProvider";

export function ContactDetailRoute() {
  const {t} = useI18n();
  const {id} = useParams();

  if (!id) {
    return (
      <FullPageState description={t("contacts.missingId")} title={t("contacts.detailTitle")} />
    );
  }

  return <ContactDetailRouteBody key={id} id={id} />;
}

function ContactDetailRouteBody({id}: {id: string}) {
  const editor = useContactEditor(id);

  return (
    <ContactDetailPage
      contact={editor.contact}
      employees={editor.employees}
      errorMessage={editor.errorMessage}
      loading={editor.loading}
      onChange={editor.setValues}
      onRetry={editor.retry}
      onSafetyAcknowledgedChange={editor.setSafetyAcknowledged}
      payloads={editor.payloads}
      satellites={editor.satellites}
      saving={editor.saving}
      safety={editor.safety}
      safetyAcknowledged={editor.safetyAcknowledged}
      safetyBlocked={editor.safetyBlocked}
      stations={editor.stations}
      values={editor.values}
    />
  );
}
