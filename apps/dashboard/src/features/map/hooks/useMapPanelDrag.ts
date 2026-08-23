import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";

import {
  clampPanelPosition,
  defaultMapPanelPosition,
  isMapPanelMobileViewport,
  mapPanelContainer,
  mapPanelInsets,
  viewportToContainerPoint,
  type PanelPoint,
} from "@/features/map/lib/map-panel-position";

type UseMapPanelDragArgs = {
  open: boolean;
  statusBarHeight?: number;
};

type PanelBox = {
  panelWidth: number;
  panelHeight: number;
  containerWidth: number;
  containerHeight: number;
  containerX: number;
  containerY: number;
  panelX: number;
  panelY: number;
};

function readMapPanelBox(panel: HTMLElement): PanelBox {
  const containerEl = mapPanelContainer(panel);
  const container = containerEl?.getBoundingClientRect();
  const rect = panel.getBoundingClientRect();

  return {
    panelWidth: rect.width || panel.offsetWidth,
    panelHeight: rect.height || panel.offsetHeight,
    containerWidth: container?.width ?? window.innerWidth,
    containerHeight: container?.height ?? window.innerHeight,
    containerX: container?.left ?? 0,
    containerY: container?.top ?? 0,
    panelX: rect.left,
    panelY: rect.top,
  };
}

export function useMapPanelDrag({open, statusBarHeight = 0}: UseMapPanelDragArgs) {
  const panelRef = useRef<HTMLElement | null>(null);
  const insets = useMemo(() => mapPanelInsets(statusBarHeight), [statusBarHeight]);
  const dragOriginRef = useRef<{pointerX: number; pointerY: number; start: PanelPoint} | null>(
    null,
  );
  const [position, setPosition] = useState<PanelPoint | null>(null);
  const positionRef = useRef(position);
  positionRef.current = position;
  const [moved, setMoved] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [mobile, setMobile] = useState(() =>
    typeof window === "undefined" ? false : isMapPanelMobileViewport(window.innerWidth),
  );

  const syncCenteredPosition = useCallback(() => {
    if (!open || moved || mobile || !panelRef.current) {
      return;
    }

    const box = readMapPanelBox(panelRef.current);
    setPosition(
      defaultMapPanelPosition({
        panelWidth: box.panelWidth,
        panelHeight: box.panelHeight,
        containerWidth: box.containerWidth,
        containerHeight: box.containerHeight,
        insets,
      }),
    );
  }, [insets, mobile, moved, open]);

  const clampToContainer = useCallback(
    (point: PanelPoint) => {
      if (!panelRef.current) {
        return point;
      }

      const box = readMapPanelBox(panelRef.current);
      return clampPanelPosition({
        x: point.x,
        y: point.y,
        panelWidth: box.panelWidth,
        panelHeight: box.panelHeight,
        viewportWidth: box.containerWidth,
        viewportHeight: box.containerHeight,
        insets,
      });
    },
    [insets],
  );

  useEffect(() => {
    if (!open) {
      setMoved(false);
      setDragging(false);
      setPosition(null);
      dragOriginRef.current = null;
      return;
    }

    const frame = window.requestAnimationFrame(() => syncCenteredPosition());
    return () => window.cancelAnimationFrame(frame);
  }, [open, syncCenteredPosition]);

  useEffect(() => {
    if (!open || mobile || !panelRef.current) {
      return;
    }

    const containerEl = mapPanelContainer(panelRef.current);
    const observer = new ResizeObserver(() => {
      if (!moved) {
        syncCenteredPosition();
        return;
      }

      const current = positionRef.current;
      if (!current) {
        return;
      }

      setPosition(clampToContainer(current));
    });
    observer.observe(panelRef.current);
    if (containerEl) {
      observer.observe(containerEl);
    }
    return () => observer.disconnect();
  }, [clampToContainer, mobile, moved, open, syncCenteredPosition]);

  useEffect(() => {
    const onViewport = () => setMobile(isMapPanelMobileViewport(window.innerWidth));
    window.addEventListener("resize", onViewport);
    return () => window.removeEventListener("resize", onViewport);
  }, []);

  const onDragHandlePointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if (mobile || !panelRef.current || event.button !== 0) {
      return;
    }

    const target = event.target as HTMLElement | null;
    if (target?.closest("button")) {
      return;
    }

    event.preventDefault();
    const box = readMapPanelBox(panelRef.current);
    const current =
      position ?? viewportToContainerPoint(box.panelX, box.panelY, box.containerX, box.containerY);
    dragOriginRef.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      start: current,
    };
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onDragHandlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (!dragging || !dragOriginRef.current || !panelRef.current) {
      return;
    }

    const origin = dragOriginRef.current;
    setMoved(true);
    setPosition(
      clampToContainer({
        x: origin.start.x + (event.clientX - origin.pointerX),
        y: origin.start.y + (event.clientY - origin.pointerY),
      }),
    );
  };

  const endDrag = (event: ReactPointerEvent<HTMLElement>) => {
    if (!dragging) {
      return;
    }
    setDragging(false);
    dragOriginRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const panelStyle: CSSProperties | undefined =
    open && !mobile
      ? ({
          ...(position
            ? {
                left: position.x,
                top: position.y,
                right: "auto",
                transform: "none",
              }
            : undefined),
          "--map-panel-top-inset": `${insets.top}px`,
          "--map-panel-bottom-inset": `${insets.bottom}px`,
        } as CSSProperties)
      : undefined;

  return {
    panelRef,
    style: panelStyle,
    dragging,
    mobile,
    dragHandleProps: {
      onPointerDown: onDragHandlePointerDown,
      onPointerMove: onDragHandlePointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
    },
  };
}
