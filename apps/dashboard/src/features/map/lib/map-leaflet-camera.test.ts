import {describe, expect, it} from "vitest";

import {
  emptyFleetMapCameraMemory,
  fleetMapContentKey,
  planFleetMapCamera,
} from "./map-leaflet-camera";
import {visibleFleetMapPoints} from "./map-leaflet-content";
import type {FleetMapPoint} from "./map-points";

const satellite: FleetMapPoint = {
  id: "sat-1",
  kind: "satellite",
  name: "Horizon-1",
  latitude: 10,
  longitude: 20,
  href: "/satellites/sat-1",
  status: "In Orbit",
};

const station: FleetMapPoint = {
  id: "gs-1",
  kind: "station",
  name: "Station",
  latitude: 1,
  longitude: 2,
  href: "/stations/gs-1",
  status: "Online",
};

describe("planFleetMapCamera", () => {
  it("fits the world on first paint without selection", () => {
    const plan = planFleetMapCamera({
      memory: emptyFleetMapCameraMemory(),
      selectedSatelliteId: "",
      selectedStationId: "",
      visiblePoints: [satellite],
      trackSegments: [],
      showTrack: false,
      followTarget: null,
      contactPlannerOpen: false,
      fitFleet: false,
      focusSelection: false,
      fitNonce: 0,
      worldNonce: 0,
      statusBarInset: 0,
    });

    expect(plan.action).toEqual({kind: "fit-world", animate: false});
    expect(plan.memory.didInitialFit).toBe(true);
  });

  it("recenters when selection focus changes", () => {
    const memory = emptyFleetMapCameraMemory();
    memory.didInitialFit = true;
    memory.contentKey = fleetMapContentKey("sat-1", 0, false);

    const plan = planFleetMapCamera({
      memory,
      selected: satellite,
      selectedSatelliteId: "sat-1",
      selectedStationId: "",
      visiblePoints: [satellite],
      trackSegments: [],
      showTrack: false,
      followTarget: null,
      contactPlannerOpen: false,
      fitFleet: false,
      focusSelection: false,
      fitNonce: 0,
      worldNonce: 0,
      statusBarInset: 0,
    });

    expect(plan.action).toEqual({kind: "recenter", point: satellite, deepLink: false});
  });

  it("recenters again when the selection key changes", () => {
    const memory = emptyFleetMapCameraMemory();
    memory.didInitialFit = true;
    memory.contentKey = fleetMapContentKey("sat-1", 0, false);
    memory.selectionFocusKey = "satellite:sat-1";

    const other: FleetMapPoint = {
      ...satellite,
      id: "sat-2",
      name: "Horizon-2",
    };

    const plan = planFleetMapCamera({
      memory,
      selected: other,
      selectedSatelliteId: "sat-2",
      selectedStationId: "",
      visiblePoints: [satellite, other],
      trackSegments: [],
      showTrack: false,
      followTarget: null,
      contactPlannerOpen: false,
      fitFleet: false,
      focusSelection: false,
      fitNonce: 0,
      worldNonce: 0,
      statusBarInset: 0,
    });

    expect(plan.action).toEqual({kind: "recenter", point: other, deepLink: false});
  });

  it("does not re-recenter the same selection after focus was applied", () => {
    const memory = emptyFleetMapCameraMemory();
    memory.didInitialFit = true;
    memory.contentKey = fleetMapContentKey("sat-1", 0, false);
    memory.selectionFocusKey = "satellite:sat-1";

    const plan = planFleetMapCamera({
      memory,
      selected: satellite,
      selectedSatelliteId: "sat-1",
      selectedStationId: "",
      visiblePoints: [satellite],
      trackSegments: [],
      showTrack: false,
      followTarget: null,
      contactPlannerOpen: false,
      fitFleet: false,
      focusSelection: false,
      fitNonce: 0,
      worldNonce: 0,
      statusBarInset: 0,
    });
    expect(plan.action.kind).toBe("none");
  });

  it("follows a moving target only when the follow key changes", () => {
    const memory = emptyFleetMapCameraMemory();
    memory.didInitialFit = true;
    memory.followKey = "10.0000:20.0000";
    memory.selectionFocusKey = "satellite:sat-1";

    const same = planFleetMapCamera({
      memory,
      selected: satellite,
      selectedSatelliteId: "sat-1",
      selectedStationId: "",
      visiblePoints: [satellite],
      trackSegments: [],
      showTrack: false,
      followTarget: [10, 20],
      contactPlannerOpen: false,
      fitFleet: false,
      focusSelection: false,
      fitNonce: 0,
      worldNonce: 0,
      statusBarInset: 0,
    });
    expect(same.action.kind).toBe("none");

    const moved = planFleetMapCamera({
      memory: same.memory,
      selected: satellite,
      selectedSatelliteId: "sat-1",
      selectedStationId: "",
      visiblePoints: [satellite],
      trackSegments: [],
      showTrack: false,
      followTarget: [10.1, 20.2],
      contactPlannerOpen: false,
      fitFleet: false,
      focusSelection: false,
      fitNonce: 0,
      worldNonce: 0,
      statusBarInset: 0,
    });
    expect(moved.action.kind).toBe("follow");
    if (moved.action.kind === "follow") {
      expect(moved.action.previousFollowKey).toBe("10.0000:20.0000");
      expect(moved.action.followKey).toBe("10.1000:20.2000");
    }
  });

  it("fits fleet once then skips a second fit", () => {
    const memory = emptyFleetMapCameraMemory();
    memory.didInitialFit = true;
    memory.selectionFocusKey = "satellite:sat-1";

    const plan = planFleetMapCamera({
      memory,
      selected: satellite,
      selectedSatelliteId: "sat-1",
      selectedStationId: "",
      visiblePoints: [satellite],
      trackSegments: [],
      showTrack: false,
      followTarget: null,
      contactPlannerOpen: false,
      fitFleet: true,
      focusSelection: false,
      fitNonce: 0,
      worldNonce: 0,
      statusBarInset: 0,
    });

    expect(plan.clearFleetFit).toBe(true);
    expect(plan.memory.fleetFitApplied).toBe(true);
    expect(plan.action.kind).toBe("fit-points");

    const again = planFleetMapCamera({
      memory: plan.memory,
      selected: satellite,
      selectedSatelliteId: "sat-1",
      selectedStationId: "",
      visiblePoints: [satellite],
      trackSegments: [],
      showTrack: false,
      followTarget: null,
      contactPlannerOpen: false,
      fitFleet: true,
      focusSelection: false,
      fitNonce: 0,
      worldNonce: 0,
      statusBarInset: 0,
    });
    expect(again.clearFleetFit).toBe(false);
    expect(again.action.kind).toBe("none");
  });
});

describe("visibleFleetMapPoints", () => {
  it("filters by layer flags", () => {
    expect(visibleFleetMapPoints([satellite, station], true, false)).toEqual([satellite]);
    expect(visibleFleetMapPoints([satellite, station], false, true)).toEqual([station]);
  });
});
