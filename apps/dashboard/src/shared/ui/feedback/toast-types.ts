export type ToastTone = "success" | "error" | "info" | "warning";

export type ToastInput = {
  message: string;
  tone?: ToastTone;
  durationMs?: number;
};

export type ToastItem = {
  id: string;
  message: string;
  tone: ToastTone;
  durationMs: number;
};

export type ToastContextValue = {
  push: (input: ToastInput) => string;
  dismiss: (id: string) => void;
  success: (message: string, durationMs?: number) => string;
  error: (message: string, durationMs?: number) => string;
  info: (message: string, durationMs?: number) => string;
  warning: (message: string, durationMs?: number) => string;
};
