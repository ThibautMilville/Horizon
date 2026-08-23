export type TooltipPlacement = "top" | "bottom" | "left" | "right";

export type TooltipCoords = {
  top: number;
  left: number;
  placement: TooltipPlacement;
};

const VIEWPORT_MARGIN = 8;
const DISTANCE = 8;

export function chooseTooltipCoords(input: {
  trigger: {
    top: number;
    right: number;
    bottom: number;
    left: number;
    width: number;
    height: number;
  };
  tipWidth: number;
  tipHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  prefer?: TooltipPlacement;
}): TooltipCoords {
  const prefer = input.prefer ?? "bottom";
  const {trigger, tipWidth, tipHeight, viewportWidth, viewportHeight} = input;

  const spaceBelow = viewportHeight - trigger.bottom - VIEWPORT_MARGIN;
  const spaceAbove = trigger.top - VIEWPORT_MARGIN;
  const spaceRight = viewportWidth - trigger.right - VIEWPORT_MARGIN;
  const spaceLeft = trigger.left - VIEWPORT_MARGIN;

  const neededVertical = tipHeight + DISTANCE;
  const neededHorizontal = tipWidth + DISTANCE;

  const fits: Record<TooltipPlacement, boolean> = {
    bottom: spaceBelow >= neededVertical,
    top: spaceAbove >= neededVertical,
    right: spaceRight >= neededHorizontal,
    left: spaceLeft >= neededHorizontal,
  };

  const order: TooltipPlacement[] = [
    prefer,
    ...(["bottom", "top", "right", "left"] as const).filter((value) => value !== prefer),
  ];

  let placement = order.find((value) => fits[value]);
  if (!placement) {
    const scores: Record<TooltipPlacement, number> = {
      bottom: spaceBelow,
      top: spaceAbove,
      right: spaceRight,
      left: spaceLeft,
    };
    placement = (Object.keys(scores) as TooltipPlacement[]).reduce((best, next) =>
      scores[next] > scores[best] ? next : best,
    );
  }

  const centerX = trigger.left + trigger.width / 2;
  const centerY = trigger.top + trigger.height / 2;

  if (placement === "bottom") {
    return {
      placement,
      top: trigger.bottom + DISTANCE,
      left: clampCenter(centerX, tipWidth, viewportWidth),
    };
  }

  if (placement === "top") {
    return {
      placement,
      top: trigger.top - DISTANCE - tipHeight,
      left: clampCenter(centerX, tipWidth, viewportWidth),
    };
  }

  if (placement === "right") {
    return {
      placement,
      top: clampCenter(centerY, tipHeight, viewportHeight),
      left: trigger.right + DISTANCE,
    };
  }

  return {
    placement,
    top: clampCenter(centerY, tipHeight, viewportHeight),
    left: trigger.left - DISTANCE - tipWidth,
  };
}

function clampCenter(center: number, size: number, viewport: number): number {
  const half = size / 2;
  return Math.min(Math.max(center, VIEWPORT_MARGIN + half), viewport - VIEWPORT_MARGIN - half);
}
