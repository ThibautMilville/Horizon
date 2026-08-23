import {useI18n} from "@/shared/preferences/PreferencesProvider";
import {ButtonLink} from "@/shared/ui/actions/Button";
import {FullPageState} from "@/shared/ui/layout/FullPageState";

export function NotFoundPage() {
  const {t} = useI18n();

  return (
    <FullPageState
      code="404"
      description={t("common.notFoundDescription")}
      title={t("common.notFound")}
      action={
        <ButtonLink to="/map" variant="primary">
          {t("common.goToMap")}
        </ButtonLink>
      }
    />
  );
}
