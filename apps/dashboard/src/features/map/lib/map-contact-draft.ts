import {emptyContactFormValues, type ContactFormValues} from "@/shared/lib/contact-form-values";

import type {FleetMapPoint} from "./map-points";
import {resolveMapSelectionIds} from "./map-selection";

export function utcDateTimeLocalValue(now = new Date()): string {
  return now.toISOString().slice(0, 16);
}

export function buildMapContactSeed(input: {
  now?: Date;
  selectedPoint?: FleetMapPoint;
  selectedSatelliteId: string;
  selectedStationId: string;
}): ContactFormValues {
  const {satelliteId, stationId} = resolveMapSelectionIds(input);

  return {
    ...emptyContactFormValues,
    date: utcDateTimeLocalValue(input.now),
    type: "Customer Task",
    executionScript: "pass",
    configurationText: "{\n}\n",
    satellite_id: satelliteId,
    groundStation_id: stationId,
    payload_id: "",
    employee_id: "",
  };
}

export function applyMapSelectionToContactDraft(
  values: ContactFormValues,
  input: {
    selectedPoint?: FleetMapPoint;
    selectedSatelliteId: string;
    selectedStationId: string;
  },
): ContactFormValues {
  const {satelliteId, stationId} = resolveMapSelectionIds(input);
  const next = {...values};

  if (satelliteId) {
    next.satellite_id = satelliteId;
    if (satelliteId !== values.satellite_id) {
      next.payload_id = "";
    }
  }

  if (stationId) {
    next.groundStation_id = stationId;
  }

  return next;
}

export function mapContactDraftMissing(values: ContactFormValues): string[] {
  const missing: string[] = [];
  if (!values.date) {
    missing.push("instant");
  }
  if (!values.type) {
    missing.push("type");
  }
  if (!values.groundStation_id) {
    missing.push("station");
  }
  if (!values.satellite_id) {
    missing.push("satellite");
  }
  if (!values.employee_id) {
    missing.push("operator");
  }
  return missing;
}
