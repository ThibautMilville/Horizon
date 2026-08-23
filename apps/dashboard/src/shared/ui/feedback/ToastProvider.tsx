import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {setToastListener} from "./toast-bus";
import type {ToastContextValue, ToastInput, ToastItem, ToastTone} from "./toast-types";
import {ToastStack} from "./ToastStack";

const DEFAULT_DURATION_MS = 4500;
const MAX_TOASTS = 5;
const EXIT_MS = 220;

const ToastContext = createContext<ToastContextValue | null>(null);

function createToast(input: ToastInput): ToastItem {
  return {
    id: crypto.randomUUID(),
    message: input.message,
    tone: input.tone ?? "info",
    durationMs: input.durationMs ?? DEFAULT_DURATION_MS,
  };
}

function pushTone(
  push: (input: ToastInput) => string,
  tone: ToastTone,
  message: string,
  durationMs?: number,
): string {
  return push({message, tone, durationMs});
}

type ToastProviderProps = {
  children: ReactNode;
};

export function ToastProvider({children}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback((input: ToastInput) => {
    const toast = createToast(input);
    setToasts((current) => [...current, toast].slice(-MAX_TOASTS));
    return toast.id;
  }, []);

  useEffect(() => {
    setToastListener(push);
    return () => {
      setToastListener(null);
    };
  }, [push]);

  const value = useMemo<ToastContextValue>(
    () => ({
      push,
      dismiss,
      success: (message, durationMs) => pushTone(push, "success", message, durationMs),
      error: (message, durationMs) => pushTone(push, "error", message, durationMs),
      info: (message, durationMs) => pushTone(push, "info", message, durationMs),
      warning: (message, durationMs) => pushTone(push, "warning", message, durationMs),
    }),
    [dismiss, push],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastStack exitMs={EXIT_MS} onDismiss={dismiss} toasts={toasts} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const value = useContext(ToastContext);
  if (!value) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return value;
}
