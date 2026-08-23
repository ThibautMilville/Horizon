export type PanelPoint = {
  x: number;
  y: number;
};

export type MapPanelInsets = {
  top: number;
  bottom: number;
};

export const MAP_PANEL_MARGIN = 14;
export const MAP_STATUS_BAR_ESTIMATE_HEIGHT = 70;

export function mapStatusBarInset(measuredHeight: number, showStatusBar: boolean): number {
  if (!showStatusBar) {
    return 0;
  }

  return measuredHeight > 0 ? measuredHeight : MAP_STATUS_BAR_ESTIMATE_HEIGHT;
}

export function mapPanelInsets(statusBarHeight = 0, margin = MAP_PANEL_MARGIN): MapPanelInsets {
  return {
    top: margin,
    bottom: margin + statusBarHeight,
  };
}

export function clampPanelPosition(input: {
  x: number;
  y: number;
  panelWidth: number;
  panelHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  margin?: number;
  insets?: MapPanelInsets;
}): PanelPoint {
  const margin = input.margin ?? MAP_PANEL_MARGIN;
  const topInset = input.insets?.top ?? margin;
  const bottomInset = input.insets?.bottom ?? margin;
  const maxX = Math.max(margin, input.viewportWidth - input.panelWidth - margin);
  const maxY = Math.max(topInset, input.viewportHeight - input.panelHeight - bottomInset);

  return {
    x: Math.min(maxX, Math.max(margin, input.x)),
    y: Math.min(maxY, Math.max(topInset, input.y)),
  };
}

export function defaultMapPanelPosition(input: {
  panelWidth: number;
  panelHeight: number;
  containerWidth: number;
  containerHeight: number;
  margin?: number;
  insets?: MapPanelInsets;
}): PanelPoint {
  const margin = input.margin ?? MAP_PANEL_MARGIN;
  const insets = input.insets ?? mapPanelInsets(0, margin);
  const maxY = Math.max(insets.top, input.containerHeight - input.panelHeight - insets.bottom);
  const availableHeight = input.containerHeight - insets.top - insets.bottom;
  const idealY = insets.top + (availableHeight - input.panelHeight) / 2;

  return {
    x: Math.max(margin, input.containerWidth - input.panelWidth - margin),
    y: Math.min(maxY, Math.max(insets.top, idealY)),
  };
}

export function viewportToContainerPoint(
  viewportX: number,
  viewportY: number,
  containerLeft: number,
  containerTop: number,
): PanelPoint {
  return {
    x: viewportX - containerLeft,
    y: viewportY - containerTop,
  };
}

export function isMapPanelMobileViewport(width: number, breakpoint = 560): boolean {
  return width <= breakpoint;
}

export function mapPanelContainer(panel: HTMLElement): HTMLElement | null {
  return panel.offsetParent instanceof HTMLElement ? panel.offsetParent : panel.parentElement;
}
