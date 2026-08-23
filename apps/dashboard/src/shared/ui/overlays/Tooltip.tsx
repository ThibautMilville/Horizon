import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import {createPortal} from "react-dom";

import {InfoIcon} from "@/shared/ui/actions/action-icons";

import {chooseTooltipCoords, type TooltipPlacement} from "./tooltip-placement";

import styles from "./Tooltip.module.scss";

type TooltipProps = {
  content: ReactNode;
  children: ReactNode;
  position?: TooltipPlacement;
  disabled?: boolean;
  className?: string;
  multiline?: boolean;
};

type InfoTooltipProps = {
  content: string;
  position?: TooltipPlacement;
};

export function Tooltip({
  content,
  children,
  position = "bottom",
  disabled = false,
  className,
  multiline = false,
}: TooltipProps) {
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const tooltipId = useId();
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState<{top: number; left: number; placement: TooltipPlacement}>({
    top: 0,
    left: 0,
    placement: position,
  });

  useLayoutEffect(() => {
    if (!visible || disabled || !triggerRef.current || !tipRef.current) {
      return;
    }

    const update = () => {
      if (!triggerRef.current || !tipRef.current) {
        return;
      }

      const trigger = triggerRef.current.getBoundingClientRect();
      const tip = tipRef.current.getBoundingClientRect();
      const next = chooseTooltipCoords({
        trigger,
        tipWidth: tip.width,
        tipHeight: tip.height,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        prefer: position,
      });
      setCoords((prev) =>
        prev.top === next.top && prev.left === next.left && prev.placement === next.placement
          ? prev
          : next,
      );
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(tipRef.current);
    return () => observer.disconnect();
  }, [visible, disabled, content, position]);

  useEffect(() => {
    if (!visible) {
      return;
    }

    const hide = () => setVisible(false);
    window.addEventListener("scroll", hide, true);
    window.addEventListener("resize", hide);
    return () => {
      window.removeEventListener("scroll", hide, true);
      window.removeEventListener("resize", hide);
    };
  }, [visible]);

  const child = Children.only(children);
  const trigger = isValidElement(child)
    ? cloneElement(child as ReactElement<{title?: string; "aria-describedby"?: string}>, {
        title: undefined,
        "aria-describedby": visible ? tooltipId : undefined,
      })
    : child;

  return (
    <>
      <span
        className={`${styles.trigger}${className ? ` ${className}` : ""}`}
        onBlur={() => setVisible(false)}
        onFocus={() => {
          if (!disabled) {
            setVisible(true);
          }
        }}
        onMouseEnter={() => {
          if (!disabled) {
            setVisible(true);
          }
        }}
        onMouseLeave={() => setVisible(false)}
        ref={triggerRef}
      >
        {trigger}
      </span>
      {visible && !disabled
        ? createPortal(
            <div
              className={`${styles.tooltip} ${styles[coords.placement]}${multiline ? ` ${styles.multiline}` : ""}`}
              id={tooltipId}
              ref={tipRef}
              role="tooltip"
              style={{top: coords.top, left: coords.left}}
            >
              {content}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

export function InfoTooltip({content, position = "top"}: InfoTooltipProps) {
  return (
    <Tooltip content={content} multiline position={position}>
      <button
        aria-label={content}
        className={styles["info-button"]}
        onClick={(event) => {
          event.preventDefault();
        }}
        type="button"
      >
        <InfoIcon />
      </button>
    </Tooltip>
  );
}
