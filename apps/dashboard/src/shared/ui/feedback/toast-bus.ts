import type {ToastInput} from "./toast-types";

type ToastListener = (input: ToastInput) => void;

let listener: ToastListener | null = null;

export function setToastListener(next: ToastListener | null): void {
  listener = next;
}

export function emitToast(input: ToastInput): void {
  listener?.(input);
}
