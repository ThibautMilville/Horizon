import {messagesEn} from "./messages-en";
import {messagesFr} from "./messages-fr";
import type {MessageKey} from "./messages-en";

export {messagesEn, messagesFr};
export type {MessageDict, MessageKey} from "./messages-en";

export function translate(
  language: "en" | "fr",
  key: MessageKey,
  vars?: Record<string, string>,
): string {
  const dict = language === "fr" ? messagesFr : messagesEn;
  let value = dict[key] ?? messagesEn[key] ?? key;
  if (vars) {
    for (const [name, replacement] of Object.entries(vars)) {
      value = value.replaceAll(`{${name}}`, replacement);
    }
  }
  return value;
}
