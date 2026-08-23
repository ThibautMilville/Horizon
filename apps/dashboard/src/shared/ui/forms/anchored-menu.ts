export type AnchoredMenuCoords = {
  top?: number;
  bottom?: number;
  left: number;
  width: number;
  maxHeight: number;
  openUpward: boolean;
  compact: boolean;
};

const VIEWPORT_MARGIN = 8;
const MENU_GAP = 6;
const COMPACT_BREAKPOINT = 560;

export function chooseAnchoredMenuCoords(input: {
  trigger: {
    top: number;
    right: number;
    bottom: number;
    left: number;
    width: number;
  };
  viewportWidth: number;
  viewportHeight: number;
  preferredMaxHeight?: number;
  minHeight?: number;
  minWidth?: number;
}): AnchoredMenuCoords {
  const preferredMaxHeight = input.preferredMaxHeight ?? 320;
  const minHeight = input.minHeight ?? 140;
  const compact = input.viewportWidth <= COMPACT_BREAKPOINT;
  const minWidth = input.minWidth ?? input.trigger.width;
  const spaceBelow = input.viewportHeight - input.trigger.bottom - VIEWPORT_MARGIN;
  const spaceAbove = input.trigger.top - VIEWPORT_MARGIN;
  const openUpward = spaceBelow < 220 && spaceAbove > spaceBelow;
  const available = openUpward ? spaceAbove : spaceBelow;
  const maxHeight = Math.max(
    minHeight,
    Math.min(preferredMaxHeight, available, input.viewportHeight - VIEWPORT_MARGIN * 2),
  );

  const width = compact
    ? Math.max(minWidth, input.viewportWidth - VIEWPORT_MARGIN * 2)
    : Math.min(Math.max(minWidth, input.trigger.width), input.viewportWidth - VIEWPORT_MARGIN * 2);

  const left = compact
    ? VIEWPORT_MARGIN
    : Math.min(
        Math.max(VIEWPORT_MARGIN, input.trigger.left),
        Math.max(VIEWPORT_MARGIN, input.viewportWidth - VIEWPORT_MARGIN - width),
      );

  if (openUpward) {
    return {
      openUpward: true,
      compact,
      bottom: input.viewportHeight - input.trigger.top + MENU_GAP,
      left,
      width,
      maxHeight,
    };
  }

  return {
    openUpward: false,
    compact,
    top: input.trigger.bottom + MENU_GAP,
    left,
    width,
    maxHeight,
  };
}
