import {useEffect, useState, type ReactNode} from "react";

type DelayedFallbackProps = {
  children: ReactNode;
  delayMs?: number;
};

export function DelayedFallback({children, delayMs = 180}: DelayedFallbackProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setVisible(true), delayMs);
    return () => window.clearTimeout(timeoutId);
  }, [delayMs]);

  if (!visible) {
    return null;
  }

  return children;
}
