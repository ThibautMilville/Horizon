import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";

import {useFloatingLayerEvents} from "@/shared/ui/overlays/useFloatingLayerEvents";

import {chooseAnchoredMenuCoords, type AnchoredMenuCoords} from "./anchored-menu";

export type SelectMenuOption = {
  value: string;
  label: string;
  disabled?: boolean;
  leading?: ReactNode;
};

export function filterSelectOptions(
  options: SelectMenuOption[],
  searchTerm: string,
): SelectMenuOption[] {
  const query = searchTerm.trim().toLowerCase();
  if (!query) {
    return options;
  }
  return options.filter((option) => option.label.toLowerCase().includes(query));
}

export function nextEnabledOptionIndex(
  options: SelectMenuOption[],
  current: number | null,
  direction: 1 | -1,
): number | null {
  if (options.length === 0) {
    return null;
  }

  let index = current ?? (direction === 1 ? -1 : 0);
  for (let offset = 0; offset < options.length; offset += 1) {
    index = (index + direction + options.length) % options.length;
    if (!options[index]?.disabled) {
      return index;
    }
  }
  return null;
}

type UseSelectMenuArgs = {
  disabled?: boolean;
  options: SelectMenuOption[];
  value: string;
  onChange: (value: string) => void;
};

export function useSelectMenu({disabled = false, options, value, onChange}: UseSelectMenuArgs) {
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [menuCoords, setMenuCoords] = useState<AnchoredMenuCoords | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const filteredOptions = filterSelectOptions(options, searchTerm);
  const getOptionId = useCallback((index: number) => `${listId}-option-${index}`, [listId]);

  const close = useCallback(() => {
    setOpen(false);
    setSearchTerm("");
    setActiveIndex(null);
    setMenuCoords(null);
  }, []);

  const updateMenuPosition = useCallback(() => {
    if (!triggerRef.current) {
      return;
    }

    const rect = triggerRef.current.getBoundingClientRect();
    setMenuCoords(
      chooseAnchoredMenuCoords({
        trigger: {
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
          left: rect.left,
          width: rect.width,
        },
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        preferredMaxHeight: 320,
        minHeight: 140,
      }),
    );
  }, []);

  const openMenu = useCallback(() => {
    if (disabled) {
      return;
    }
    setOpen(true);
    const selectedIndex = options.findIndex((option) => option.value === value);
    setActiveIndex(
      selectedIndex >= 0 && !options[selectedIndex]?.disabled
        ? selectedIndex
        : nextEnabledOptionIndex(options, null, 1),
    );
  }, [disabled, options, value]);

  const toggle = useCallback(() => {
    if (open) {
      close();
      return;
    }
    openMenu();
  }, [close, open, openMenu]);

  const selectValue = useCallback(
    (next: string) => {
      const option = options.find((item) => item.value === next);
      if (!option || option.disabled || disabled) {
        return;
      }
      onChange(next);
      close();
      triggerRef.current?.blur();
    },
    [close, disabled, onChange, options],
  );

  useLayoutEffect(() => {
    if (!open) {
      return;
    }
    updateMenuPosition();
    const frame = window.requestAnimationFrame(() => updateMenuPosition());
    return () => window.cancelAnimationFrame(frame);
  }, [open, updateMenuPosition, filteredOptions.length]);

  useEffect(() => {
    if (!open) {
      return;
    }
    searchInputRef.current?.focus();
  }, [open]);

  useFloatingLayerEvents(open, {
    onPointerDown: (event) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) {
        return;
      }
      close();
    },
    onKeyDown: (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    },
    onReposition: updateMenuPosition,
  });

  const moveActiveIndex = (direction: 1 | -1) => {
    setActiveIndex((current) => nextEnabledOptionIndex(filteredOptions, current, direction));
  };

  const updateSearchTerm = (next: string) => {
    const nextOptions = filterSelectOptions(options, next);
    setSearchTerm(next);
    setActiveIndex(nextEnabledOptionIndex(nextOptions, null, 1));
  };

  const onTriggerKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (disabled) {
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        openMenu();
        return;
      }
      moveActiveIndex(event.key === "ArrowDown" ? 1 : -1);
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!open) {
        openMenu();
        return;
      }
      if (activeIndex != null) {
        const option = filteredOptions[activeIndex];
        if (option) {
          selectValue(option.value);
        }
      }
    }
  };

  const onSearchKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      moveActiveIndex(event.key === "ArrowDown" ? 1 : -1);
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      if (activeIndex != null) {
        const option = filteredOptions[activeIndex];
        if (option) {
          selectValue(option.value);
        }
      }
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      close();
      triggerRef.current?.focus();
    }
  };

  const menuStyle: CSSProperties | undefined = menuCoords
    ? {
        position: "fixed",
        top: menuCoords.top,
        bottom: menuCoords.bottom,
        left: menuCoords.left,
        width: menuCoords.width,
        maxHeight: menuCoords.maxHeight,
      }
    : undefined;

  return {
    listId,
    open,
    activeIndex,
    searchTerm,
    updateSearchTerm,
    filteredOptions,
    rootRef,
    triggerRef,
    menuRef,
    searchInputRef,
    menuStyle,
    toggle,
    close,
    selectValue,
    setActiveIndex,
    onTriggerKeyDown,
    onSearchKeyDown,
    getOptionId,
  };
}
