import type {ReactNode} from "react";

import {useI18n} from "@/shared/preferences/PreferencesProvider";
import {
  MAP_SHORTCUTS,
  formatShortcutLabel,
  tooltipWithShortcut,
} from "@/features/map/lib/map-shortcuts";
import {Tooltip} from "@/shared/ui/overlays/Tooltip";
import {SearchIcon} from "@/shared/ui/actions/action-icons";

import {
  BasemapIcon,
  ContactPassIcon,
  DayNightIcon,
  FitViewIcon,
  FocusTrackIcon,
  InfoBarIcon,
  SatelliteIcon,
  StationIcon,
  TrackIcon,
  WorldViewIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "./map-toolbar-icons";
import type {MapBasemap} from "@/features/map/lib/map-basemap";
import type {MapToolbarActions} from "../hooks/useFleetMapScreen";

import styles from "./MapToolbar.module.scss";

function mapTooltipProps(label: string, shortcut?: string) {
  return {
    ariaLabel: shortcut ? tooltipWithShortcut(label, shortcut) : label,
    content: shortcut ? (
      <>
        {label}
        <span className={styles.shortcut}> ({formatShortcutLabel(shortcut)})</span>
      </>
    ) : (
      label
    ),
  };
}

type MapToolbarLayers = {
  showSatellites: boolean;
  showStations: boolean;
  showTrack: boolean;
  showTerminator: boolean;
  showStatusBar: boolean;
  basemap: MapBasemap;
};

type MapToolbarMode = {
  canFocusAndTrack: boolean;
  tracking: boolean;
  contactPlannerOpen: boolean;
  globalSearchOpen: boolean;
};

type MapToolbarProps = {
  layers: MapToolbarLayers;
  mode: MapToolbarMode;
  actions: MapToolbarActions;
};

type ToolbarButton = {
  id: string;
  label: string;
  shortcut?: string;
  icon: ReactNode;
  onClick: () => void;
  pressed?: boolean;
  disabled?: boolean;
};

function ToolbarGroup({label, buttons}: {label: string; buttons: ToolbarButton[]}) {
  return (
    <div className={styles.group} role="group" aria-label={label}>
      {buttons.map((button) => {
        const tip = mapTooltipProps(button.label, button.shortcut);
        return (
          <Tooltip content={tip.content} key={button.id}>
            <button
              aria-label={tip.ariaLabel}
              aria-pressed={button.pressed}
              className={`${styles.button} ${button.pressed ? styles.on : ""}`}
              disabled={button.disabled}
              onClick={button.onClick}
              type="button"
            >
              {button.icon}
            </button>
          </Tooltip>
        );
      })}
    </div>
  );
}

export function MapToolbar({layers, mode, actions}: MapToolbarProps) {
  const {t} = useI18n();
  const {showSatellites, showStations, showTrack, showTerminator, showStatusBar, basemap} = layers;
  const {canFocusAndTrack, tracking, contactPlannerOpen, globalSearchOpen} = mode;

  const groups: Array<{id: string; label: string; buttons: ToolbarButton[]}> = [
    {
      id: "nav",
      label: t("map.navGroup"),
      buttons: [
        {
          id: "search",
          label: t("search.globalLabel"),
          shortcut: MAP_SHORTCUTS.search,
          icon: <SearchIcon size={18} />,
          onClick: actions.onToggleGlobalSearch,
          pressed: globalSearchOpen,
        },
        {
          id: "zoomIn",
          label: t("map.zoomIn"),
          shortcut: MAP_SHORTCUTS.zoomIn,
          icon: <ZoomInIcon />,
          onClick: actions.onZoomIn,
        },
        {
          id: "zoomOut",
          label: t("map.zoomOut"),
          shortcut: MAP_SHORTCUTS.zoomOut,
          icon: <ZoomOutIcon />,
          onClick: actions.onZoomOut,
        },
        {
          id: "fit",
          label: t("map.fitFleet"),
          shortcut: MAP_SHORTCUTS.fitFleet,
          icon: <FitViewIcon />,
          onClick: actions.onFitView,
        },
      ],
    },
    {
      id: "layers",
      label: t("map.layersGroup"),
      buttons: [
        {
          id: "infoBar",
          label: showStatusBar ? t("map.hideInfoBar") : t("map.showInfoBar"),
          shortcut: MAP_SHORTCUTS.infoBar,
          icon: <InfoBarIcon />,
          onClick: actions.onToggleStatusBar,
          pressed: showStatusBar,
        },
        {
          id: "satellites",
          label: t("nav.satellites"),
          shortcut: MAP_SHORTCUTS.satellites,
          icon: <SatelliteIcon />,
          onClick: actions.onToggleSatellites,
          pressed: showSatellites,
        },
        {
          id: "stations",
          label: t("nav.stations"),
          shortcut: MAP_SHORTCUTS.stations,
          icon: <StationIcon />,
          onClick: actions.onToggleStations,
          pressed: showStations,
        },
        {
          id: "track",
          label: t("map.groundTrack"),
          shortcut: MAP_SHORTCUTS.groundTrack,
          icon: <TrackIcon />,
          onClick: actions.onToggleTrack,
          pressed: showTrack,
        },
        {
          id: "terminator",
          label: t("map.dayNight"),
          shortcut: MAP_SHORTCUTS.dayNight,
          icon: <DayNightIcon />,
          onClick: actions.onToggleTerminator,
          pressed: showTerminator,
        },
        {
          id: "basemap",
          label: basemap === "imagery" ? t("map.switchStreets") : t("map.switchImagery"),
          shortcut: MAP_SHORTCUTS.basemap,
          icon: <BasemapIcon />,
          onClick: actions.onCycleBasemap,
        },
      ],
    },
    {
      id: "focus",
      label: t("map.focusGroup"),
      buttons: [
        {
          id: "focusTrack",
          label: tracking ? t("map.stopTracking") : t("map.focusAndTrack"),
          shortcut: MAP_SHORTCUTS.focusTrack,
          icon: <FocusTrackIcon />,
          onClick: actions.onToggleFocusAndTrack,
          pressed: tracking,
          disabled: !canFocusAndTrack && !tracking,
        },
      ],
    },
    {
      id: "planner",
      label: t("map.plannerGroup"),
      buttons: [
        {
          id: "planner",
          label: contactPlannerOpen ? t("map.closePlanner") : t("map.scheduleContact"),
          shortcut: MAP_SHORTCUTS.contactPlanner,
          icon: <ContactPassIcon />,
          onClick: actions.onToggleContactPlanner,
          pressed: contactPlannerOpen,
        },
      ],
    },
    {
      id: "world",
      label: t("map.worldGroup"),
      buttons: [
        {
          id: "world",
          label: t("map.worldOverview"),
          shortcut: MAP_SHORTCUTS.worldOverview,
          icon: <WorldViewIcon />,
          onClick: actions.onWorldOverview,
        },
      ],
    },
  ];

  return (
    <div className={styles.toolbar}>
      {groups.map((group) => (
        <ToolbarGroup buttons={group.buttons} key={group.id} label={group.label} />
      ))}
    </div>
  );
}
