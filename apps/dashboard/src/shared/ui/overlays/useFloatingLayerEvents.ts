import {useEffect, useRef} from "react";

type FloatingLayerEventHandlers = {
  onPointerDown: (event: MouseEvent) => void;
  onKeyDown: (event: KeyboardEvent) => void;
  onReposition: () => void;
};

export function useFloatingLayerEvents(
  active: boolean,
  handlers: FloatingLayerEventHandlers,
): void {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    if (!active) {
      return;
    }

    const onPointerDown = (event: MouseEvent) => handlersRef.current.onPointerDown(event);
    const onKeyDown = (event: KeyboardEvent) => handlersRef.current.onKeyDown(event);
    const onReposition = () => handlersRef.current.onReposition();

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onReposition);
    window.addEventListener("scroll", onReposition, true);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onReposition);
      window.removeEventListener("scroll", onReposition, true);
    };
  }, [active]);
}
