import {useQuery} from "@apollo/client";
import {useEffect, useMemo, useState} from "react";

import type {FleetMapQuery} from "@/shared/graphql";
import {MapContactPlannerDataDocument} from "@/shared/graphql";
import {useCommandSafetyState} from "@/shared/hooks/useCommandSafetyState";
import {isApolloRequestError, isQueryLoadingWithoutData} from "@/shared/lib/apollo-error-policy";
import {useI18n} from "@/shared/preferences/PreferencesProvider";
import type {MessageKey} from "@/shared/i18n/messages";
import {compact} from "@/shared/lib/compact";
import {emptyContactFormValues, type ContactFormValues} from "@/shared/lib/contact-form-values";
import {payloadsForSatellite} from "@/shared/lib/contact-schedule";
import {useToast} from "@/shared/ui/feedback/ToastProvider";
import {useCreateContactMutation} from "@/features/contacts/useContactMutations";

import {
  applyMapSelectionToContactDraft,
  buildMapContactSeed,
  mapContactDraftMissing,
  utcDateTimeLocalValue,
} from "@/features/map/lib/map-contact-draft";
import type {FleetMapPoint} from "@/features/map/lib/map-points";
import {parseCoordinates} from "@/features/map/lib/map-points";
import {buildSatellitePasses, type SatellitePass} from "@/features/map/lib/satellite-pass";
import {tleLines} from "@/shared/lib/tle";

type FleetMapSatellite = NonNullable<NonNullable<FleetMapQuery["allSatellites"]>[number]>;
type FleetMapStation = NonNullable<NonNullable<FleetMapQuery["allGroundStations"]>[number]>;

type UseMapContactPlannerArgs = {
  selectedPoint?: FleetMapPoint;
  selectedSatelliteId: string;
  selectedStationId: string;
  satellites: FleetMapSatellite[];
  stations: FleetMapStation[];
};

const FIELD_KEYS: Record<string, MessageKey> = {
  instant: "map.field.instant",
  type: "map.field.type",
  station: "map.field.station",
  satellite: "map.field.satellite",
  operator: "map.field.operator",
};

export function useMapContactPlanner({
  selectedPoint,
  selectedSatelliteId,
  selectedStationId,
  satellites,
  stations,
}: UseMapContactPlannerArgs) {
  const toast = useToast();
  const {t} = useI18n();
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<ContactFormValues>(emptyContactFormValues);
  const [formError, setFormError] = useState<string | null>(null);
  const [passPlanningStart, setPassPlanningStart] = useState(() => new Date());
  const {data, loading} = useQuery(MapContactPlannerDataDocument, {
    skip: !open,
  });
  const {create, saving} = useCreateContactMutation({refreshPlanner: true});
  const {
    safety,
    safetyAcknowledged,
    setSafetyAcknowledged,
    resetSafetyAcknowledgement,
    onScriptOrConfigChange,
  } = useCommandSafetyState(values.executionScript, values.configurationText);
  const contacts = useMemo(() => compact(data?.allContacts), [data?.allContacts]);
  const selectedSatellite = satellites.find((satellite) => satellite.id === values.satellite_id);
  const passOpportunities = useMemo(() => {
    if (!open) {
      return [];
    }

    const passStations = stations.flatMap((station) => {
      const coordinates = parseCoordinates(station.coordinates);
      return coordinates ? [{...station, ...coordinates}] : [];
    });
    return buildSatellitePasses(
      selectedSatellite
        ? {
            id: selectedSatellite.id,
            name: selectedSatellite.name,
            tle: tleLines(selectedSatellite.tle),
          }
        : undefined,
      passStations,
      contacts,
      {start: passPlanningStart},
    );
  }, [contacts, open, passPlanningStart, selectedSatellite, stations]);

  useEffect(() => {
    if (!open) {
      return;
    }

    setValues((current) =>
      applyMapSelectionToContactDraft(current, {
        selectedPoint,
        selectedSatelliteId,
        selectedStationId,
      }),
    );
  }, [open, selectedPoint, selectedSatelliteId, selectedStationId]);

  const openPlanner = () => {
    setFormError(null);
    setPassPlanningStart(new Date());
    setValues(
      buildMapContactSeed({
        selectedPoint,
        selectedSatelliteId,
        selectedStationId,
      }),
    );
    setOpen(true);
    resetSafetyAcknowledgement();
  };

  const closePlanner = () => {
    setOpen(false);
    setFormError(null);
    resetSafetyAcknowledgement();
  };

  const setField = <K extends keyof ContactFormValues>(key: K, value: ContactFormValues[K]) => {
    setValues((current) => {
      const next = {...current, [key]: value};
      if (key === "satellite_id" && value !== current.satellite_id) {
        next.payload_id = "";
      }
      if (key === "executionScript" || key === "configurationText") {
        onScriptOrConfigChange(
          {
            executionScript: key === "executionScript" ? String(value) : current.executionScript,
            configurationText:
              key === "configurationText" ? String(value) : current.configurationText,
          },
          current,
        );
      }
      return next;
    });
    setFormError(null);
  };

  const selectPass = (pass: SatellitePass) => {
    setValues((current) => ({
      ...current,
      date: utcDateTimeLocalValue(new Date(pass.aos)),
      satellite_id: pass.satelliteId,
      groundStation_id: pass.stationId,
      payload_id: current.satellite_id === pass.satelliteId ? current.payload_id : "",
    }));
    setFormError(null);
  };

  const submit = async () => {
    if (safety.requiresAcknowledgement && !safetyAcknowledged) {
      const message = t("contacts.safety.acknowledgementRequired");
      setFormError(message);
      toast.error(message);
      return;
    }
    const missing = mapContactDraftMissing(values);
    if (missing.length > 0) {
      const fields = missing.map((field) => t(FIELD_KEYS[field] ?? "common.unknown")).join(", ");
      const message = t("map.selectMissing", {fields});
      setFormError(message);
      toast.error(message);
      return;
    }

    try {
      await create(values);
      toast.success(t("contacts.scheduled"));
      closePlanner();
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : t("map.scheduleFailed");
      setFormError(message);
      if (!isApolloRequestError(caught)) {
        toast.error(message);
      }
    }
  };

  return {
    open,
    values,
    formError,
    saving,
    options: {
      loading: isQueryLoadingWithoutData(loading, data),
      satellites,
      stations,
      employees: compact(data?.allEmployees),
      payloads: payloadsForSatellite(compact(data?.allPayloads), values.satellite_id),
    },
    openPlanner,
    closePlanner,
    setField,
    selectPass,
    passOpportunities,
    safety,
    safetyAcknowledged,
    setSafetyAcknowledged,
    submit,
  };
}
