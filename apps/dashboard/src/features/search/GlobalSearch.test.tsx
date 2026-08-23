import {useRef, type ComponentProps} from "react";
import {screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {Route, Routes, useLocation} from "react-router-dom";
import {describe, expect, it, vi} from "vitest";

import {GlobalSearchDocument} from "@/shared/graphql";
import {renderApp} from "@/test/render";

import {GlobalSearch} from "./GlobalSearch";

function CurrentPath() {
  return <output>{useLocation().pathname}</output>;
}

const emptySearchMock = {
  request: {query: GlobalSearchDocument},
  result: {
    data: {
      allSatellites: [],
      allGroundStations: [],
      allPayloads: [],
      allCustomers: [],
      allContacts: [],
      allReports: [],
    },
  },
};

function SearchHarness({
  onClose,
  ...props
}: Omit<ComponentProps<typeof GlobalSearch>, "dismissBoundaryRef" | "onClose"> & {
  onClose: () => void;
}) {
  const boundaryRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={boundaryRef}>
      <GlobalSearch dismissBoundaryRef={boundaryRef} onClose={onClose} {...props} />
    </div>
  );
}

describe("GlobalSearch", () => {
  it("shows an entity badge and navigates to the selected detail", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderApp(
      <>
        <SearchHarness
          mapSatelliteIds={new Set()}
          mapStationIds={new Set()}
          onClose={onClose}
          onSelectSatellite={vi.fn()}
          onSelectStation={vi.fn()}
          open
        />
        <Routes>
          <Route element={<CurrentPath />} path="*" />
        </Routes>
      </>,
      {
        mocks: [
          {
            request: {query: GlobalSearchDocument},
            result: {
              data: {
                allSatellites: [
                  {id: "sat-1", name: "YAM-6", status: "active", manufacturer: "Loft"},
                ],
                allGroundStations: [],
                allPayloads: [],
                allCustomers: [],
                allContacts: [],
                allReports: [],
              },
            },
          },
        ],
      },
    );

    await user.type(screen.getByRole("combobox", {name: "Search all fleet assets"}), "yam");
    const result = await screen.findByRole("option", {name: /YAM-6/});
    expect(result).toHaveTextContent("Satellite");

    await user.click(result);
    expect(screen.getByText("/satellites/sat-1")).toBeInTheDocument();
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("selects a mapped satellite without leaving the map", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSelectSatellite = vi.fn();
    renderApp(
      <SearchHarness
        mapSatelliteIds={new Set(["sat-1"])}
        mapStationIds={new Set()}
        onClose={onClose}
        onSelectSatellite={onSelectSatellite}
        onSelectStation={vi.fn()}
        open
      />,
      {
        mocks: [
          {
            request: {query: GlobalSearchDocument},
            result: {
              data: {
                allSatellites: [
                  {id: "sat-1", name: "YAM-6", status: "active", manufacturer: "Loft"},
                ],
                allGroundStations: [],
                allPayloads: [],
                allCustomers: [],
                allContacts: [],
                allReports: [],
              },
            },
          },
        ],
      },
    );

    await user.type(screen.getByRole("combobox", {name: "Search all fleet assets"}), "yam");
    await user.click(await screen.findByRole("option", {name: /YAM-6/}));

    expect(onSelectSatellite).toHaveBeenCalledWith("sat-1");
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderApp(
      <SearchHarness
        mapSatelliteIds={new Set()}
        mapStationIds={new Set()}
        onClose={onClose}
        onSelectSatellite={vi.fn()}
        onSelectStation={vi.fn()}
        open
      />,
      {mocks: [emptySearchMock]},
    );

    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledOnce();
  });
});
