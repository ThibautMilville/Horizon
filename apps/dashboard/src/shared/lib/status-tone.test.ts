import {describe, expect, it} from "vitest";

import {
  contactTypeTone,
  countSatellitesInOrbit,
  isAttentionReport,
  isAttentionStation,
  isUnhealthySatellite,
  payloadStatusTone,
  reportTypeTone,
  satelliteStatusTone,
  stationStatusTone,
} from "./status-tone";

describe("status tones", () => {
  it("maps station statuses", () => {
    expect(stationStatusTone("Online")).toBe("ok");
    expect(stationStatusTone("Maintenance")).toBe("warn");
    expect(stationStatusTone("Offline")).toBe("danger");
    expect(stationStatusTone("Error")).toBe("danger");
    expect(stationStatusTone("Unknown")).toBe("neutral");
  });

  it("maps satellite statuses", () => {
    expect(satelliteStatusTone("In Orbit")).toBe("ok");
    expect(satelliteStatusTone("Planned")).toBe("warn");
    expect(satelliteStatusTone("Decommissioned")).toBe("danger");
    expect(satelliteStatusTone(undefined)).toBe("neutral");
    expect(isUnhealthySatellite("Planned")).toBe(true);
    expect(isUnhealthySatellite("In Orbit")).toBe(false);
    expect(countSatellitesInOrbit([{status: "In Orbit"}, {status: "Planned"}])).toBe(1);
  });

  it("flags attention statuses", () => {
    expect(isAttentionStation("Online")).toBe(false);
    expect(isAttentionStation("Offline")).toBe(true);
    expect(isAttentionReport("Incident")).toBe(true);
    expect(isAttentionReport("Maintenance")).toBe(false);
  });

  it("maps payload statuses", () => {
    expect(payloadStatusTone("Active")).toBe("ok");
    expect(payloadStatusTone("Inactive")).toBe("warn");
    expect(payloadStatusTone(undefined)).toBe("neutral");
  });

  it("maps report types", () => {
    expect(reportTypeTone("Incident")).toBe("danger");
    expect(reportTypeTone("Issue")).toBe("warn");
    expect(reportTypeTone("Maintenance")).toBe("warn");
    expect(reportTypeTone("Other")).toBe("neutral");
  });

  it("maps contact types", () => {
    expect(contactTypeTone("Maintenance")).toBe("warn");
    expect(contactTypeTone("Customer Task")).toBe("neutral");
  });
});
