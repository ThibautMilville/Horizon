import {useRef} from "react";

import {useI18n} from "@/shared/preferences/PreferencesProvider";
import {copyTextToClipboard} from "@/shared/lib/copy-text";
import {buildMapShareUrl} from "@/shared/lib/map-href";
import {Button} from "@/shared/ui/actions/Button";
import {DelayedFallback} from "@/shared/ui/feedback/DelayedFallback";
import {EmptyState} from "@/shared/ui/feedback/EmptyState";
import {ErrorState} from "@/shared/ui/feedback/ErrorState";
import {MapStageSkeleton} from "@/shared/ui/feedback/LoadingSkeletons";
import {useToast} from "@/shared/ui/feedback/ToastProvider";
import {GlobalSearch} from "@/features/search/GlobalSearch";

import type {useFleetMapScreen} from "../hooks/useFleetMapScreen";
import {FleetMapView} from "./FleetMapView";
import {MapAssetPopover} from "./MapAssetPopover";
import {MapContactPanel} from "./MapContactPanel";
import {MapStatusBar} from "./MapStatusBar";
import {MapToolbar} from "./MapToolbar";

import styles from "./FleetMapPage.module.scss";

type FleetMapPageProps = ReturnType<typeof useFleetMapScreen>;

export function FleetMapPage({
  map,
  layers,
  planner,
  panelDrag,
  tracking,
  followTarget,
  cursorLabel,
  setCursorLabel,
  selectionAnchor,
  setSelectionAnchor,
  selectedPoint,
  trackHint,
  statusHint,
  selectSatellite,
  selectStation,
  clearSelection,
  toggleFocusAndTrack,
  stopFocusAndTrack,
  globalSearchOpen,
  setGlobalSearchOpen,
  canFocusAndTrack,
  plannerOpen,
  closePlanner,
  openPlanner,
  toolbarActions,
  statusBarHeight,
  setStatusBarHeight,
}: FleetMapPageProps) {
  const {t} = useI18n();
  const toast = useToast();
  const toolsStackRef = useRef<HTMLDivElement>(null);

  const shareSelection = async () => {
    if (!selectedPoint) {
      return;
    }

    const copied = await copyTextToClipboard(
      buildMapShareUrl(selectedPoint.kind, selectedPoint.id),
    );
    if (copied) {
      toast.success(t("map.shareLinkCopied"));
    } else {
      toast.error(t("map.shareLinkFailed"));
    }
  };

  return (
    <div
      className={`${styles.stage} ${layers.showStatusBar ? "" : styles["status-hidden"]} ${layers.basemap === "streets" ? styles["basemap-streets"] : ""} ${plannerOpen ? styles["planner-open"] : ""}`}
    >
      <div className={styles.vignette} aria-hidden="true" />
      {map.errorMessage ? (
        <div className={styles.panel}>
          <ErrorState
            action={
              <Button onClick={map.retry} variant="secondary">
                {t("common.retry")}
              </Button>
            }
            message={map.errorMessage}
            title={t("map.loadFailed")}
          />
        </div>
      ) : map.loading ? (
        <DelayedFallback>
          <MapStageSkeleton />
        </DelayedFallback>
      ) : map.points.length === 0 ? (
        <div className={styles.panel}>
          <EmptyState message={t("map.noCoordinates")} />
        </div>
      ) : (
        <>
          <div className={styles["tools-stack"]} ref={toolsStackRef}>
            <MapToolbar
              actions={toolbarActions}
              layers={{
                basemap: layers.basemap,
                showSatellites: layers.showSatellites,
                showStations: layers.showStations,
                showStatusBar: layers.showStatusBar,
                showTerminator: layers.showTerminator,
                showTrack: layers.showTrack,
              }}
              mode={{
                canFocusAndTrack,
                contactPlannerOpen: plannerOpen,
                globalSearchOpen,
                tracking,
              }}
            />
            <GlobalSearch
              dismissBoundaryRef={toolsStackRef}
              mapSatelliteIds={map.satelliteIds}
              mapStationIds={map.stationIds}
              onClose={() => setGlobalSearchOpen(false)}
              onSelectSatellite={selectSatellite}
              onSelectStation={selectStation}
              open={globalSearchOpen}
            />
          </div>
          <FleetMapView
            basemap={layers.basemap}
            center={map.center}
            contactPlannerOpen={plannerOpen}
            fitFleet={map.fitFleet}
            focusSelection={map.focusSelection}
            onClearFleetFit={map.clearFleetFit}
            onClearFocusSelection={map.clearFocusSelection}
            fitNonce={layers.fitNonce}
            followTarget={followTarget}
            onCursorMove={setCursorLabel}
            onSelectSatellite={selectSatellite}
            onSelectStation={selectStation}
            onSelectionAnchor={setSelectionAnchor}
            onUserPan={stopFocusAndTrack}
            points={map.points}
            selectedSatelliteId={map.selectedSatelliteId}
            selectedStationId={map.selectedStationId}
            showSatellites={layers.showSatellites}
            showStations={layers.showStations}
            showTerminator={layers.showTerminator}
            showTrack={layers.showTrack}
            showStatusBar={layers.showStatusBar}
            statusBarHeight={layers.showStatusBar ? statusBarHeight : 0}
            trackSegments={map.trackSegments}
            worldNonce={layers.worldNonce}
            zoom={map.zoom}
            zoomCommand={layers.zoomCommand}
          />
          {selectedPoint && selectionAnchor ? (
            <MapAssetPopover
              anchor={selectionAnchor}
              onClear={clearSelection}
              onShare={shareSelection}
              onScheduleContact={openPlanner}
              onToggleFocusAndTrack={toggleFocusAndTrack}
              point={selectedPoint}
              trackHint={trackHint}
              tracking={tracking}
            />
          ) : null}
          <MapContactPanel
            drag={panelDrag}
            employees={planner.options.employees}
            formError={planner.formError}
            onChange={planner.setField}
            onClose={closePlanner}
            onSubmit={planner.submit}
            onSelectPass={planner.selectPass}
            onSafetyAcknowledgedChange={planner.setSafetyAcknowledged}
            open={plannerOpen}
            optionsLoading={planner.options.loading}
            payloads={planner.options.payloads}
            passOpportunities={planner.passOpportunities}
            satellites={planner.options.satellites}
            saving={planner.saving}
            safety={planner.safety}
            safetyAcknowledged={planner.safetyAcknowledged}
            selectedLabel={selectedPoint?.name}
            stations={planner.options.stations}
            values={planner.values}
          />
          <MapStatusBar
            basemap={layers.basemap}
            cursorLabel={cursorLabel}
            hint={statusHint}
            onHeightChange={setStatusBarHeight}
            trackHours={map.trackHours}
            trackVisible={layers.showTrack && map.trackSegments.length > 0}
            visible={layers.showStatusBar}
          />
        </>
      )}
    </div>
  );
}
