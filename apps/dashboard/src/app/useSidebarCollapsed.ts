import {useCallback, useState} from "react";

const SIDEBAR_COLLAPSED_KEY = "horizon.shell.sidebarCollapsed";

export function readSidebarCollapsed(storage: Storage = localStorage): boolean {
  try {
    return storage.getItem(SIDEBAR_COLLAPSED_KEY) === "1";
  } catch {
    return false;
  }
}

export function writeSidebarCollapsed(collapsed: boolean, storage: Storage = localStorage): void {
  storage.setItem(SIDEBAR_COLLAPSED_KEY, collapsed ? "1" : "0");
}

export function useSidebarCollapsed() {
  const [collapsed, setCollapsed] = useState(() => readSidebarCollapsed());

  const toggleCollapsed = useCallback(() => {
    setCollapsed((current) => {
      const next = !current;
      writeSidebarCollapsed(next);
      return next;
    });
  }, []);

  return {collapsed, toggleCollapsed};
}
