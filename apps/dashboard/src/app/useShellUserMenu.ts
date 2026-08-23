import {useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";

import {useFloatingLayerEvents} from "@/shared/ui/overlays/useFloatingLayerEvents";

const HOVER_CLOSE_MS = 220;
const MENU_GAP_PX = 4;
const BRIDGE_PX = 14;

type ShellUserMenuPosition = {
  left: number;
  bottom: number;
};

function isPointerOver(element: HTMLElement | null): boolean {
  return Boolean(element?.matches(":hover"));
}

export function useShellUserMenu() {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<ShellUserMenuPosition | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const pointerInsideRef = useRef(false);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const updatePosition = useCallback(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const rect = root.getBoundingClientRect();
    setPosition({
      left: Math.round(rect.right + MENU_GAP_PX),
      bottom: Math.round(window.innerHeight - rect.bottom),
    });
  }, []);

  const close = useCallback(() => {
    pointerInsideRef.current = false;
    clearCloseTimer();
    setOpen(false);
  }, [clearCloseTimer]);

  const openMenu = useCallback(() => {
    pointerInsideRef.current = true;
    clearCloseTimer();
    updatePosition();
    setOpen(true);
  }, [clearCloseTimer, updatePosition]);

  const onPointerEnter = useCallback(() => {
    openMenu();
  }, [openMenu]);

  const onPointerLeave = useCallback(() => {
    pointerInsideRef.current = false;
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null;
      if (pointerInsideRef.current) {
        return;
      }

      if (isPointerOver(rootRef.current) || isPointerOver(menuRef.current)) {
        pointerInsideRef.current = true;
        return;
      }

      setOpen(false);
    }, HOVER_CLOSE_MS);
  }, [clearCloseTimer]);

  useLayoutEffect(() => {
    if (!open) {
      return;
    }

    updatePosition();
  }, [open, updatePosition]);

  useFloatingLayerEvents(open, {
    onPointerDown: (event) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) {
        return;
      }

      close();
    },
    onKeyDown: (event) => {
      if (event.key === "Escape") {
        close();
      }
    },
    onReposition: updatePosition,
  });

  useEffect(() => {
    return () => {
      clearCloseTimer();
    };
  }, [clearCloseTimer]);

  return {
    open,
    position,
    bridgePx: BRIDGE_PX,
    close,
    openMenu,
    onPointerEnter,
    onPointerLeave,
    rootRef,
    menuRef,
  };
}
