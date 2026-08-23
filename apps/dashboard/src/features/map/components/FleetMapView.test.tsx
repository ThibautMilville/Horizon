import {fireEvent, screen} from "@testing-library/react";
import {describe, expect, it, vi} from "vitest";

import {renderApp} from "@/test/render";

import {FleetMapView} from "./FleetMapView";

describe("FleetMapView", () => {
  it("mounts Leaflet markers, publishes selection, and cleans up the map", async () => {
    const onSelectSatellite = vi.fn();
    const onSelectionAnchor = vi.fn();
    const {container, unmount} = renderApp(
      <div style={{height: 600, width: 900}}>
        <FleetMapView
          basemap="imagery"
          center={[0, 0]}
          fitNonce={0}
          followTarget={null}
          onCursorMove={vi.fn()}
          onSelectSatellite={onSelectSatellite}
          onSelectStation={vi.fn()}
          onSelectionAnchor={onSelectionAnchor}
          onUserPan={vi.fn()}
          points={[
            {
              id: "satellite-1",
              kind: "satellite",
              name: "Horizon-1",
              latitude: 12,
              longitude: 24,
              href: "/satellites/satellite-1",
              status: "In Orbit",
            },
          ]}
          selectedSatelliteId="satellite-1"
          selectedStationId=""
          showSatellites
          showStations
          showTerminator={false}
          showTrack={false}
          trackSegments={[]}
          worldNonce={0}
          zoom={2}
          zoomCommand={{delta: 0, nonce: 0}}
        />
      </div>,
    );

    expect(container.querySelector(".leaflet-container")).toBeInTheDocument();
    fireEvent.click(await screen.findByTitle("Horizon-1"));
    expect(onSelectSatellite).toHaveBeenCalledWith("satellite-1");
    expect(onSelectionAnchor).toHaveBeenCalled();

    unmount();
    expect(onSelectionAnchor).toHaveBeenLastCalledWith(null);
  });
});
