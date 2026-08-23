import type {TextareaHTMLAttributes} from "react";

import controlStyles from "./control.module.scss";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: boolean;
  mono?: boolean;
  tone?: "default" | "soft";
};

export function Textarea({
  className = "",
  error = false,
  mono = false,
  tone = "default",
  ...props
}: TextareaProps) {
  return (
    <textarea
      {...props}
      aria-invalid={error || props["aria-invalid"] ? true : undefined}
      className={[
        controlStyles.control,
        controlStyles.area,
        mono ? controlStyles.mono : "",
        tone === "soft" ? controlStyles.soft : "",
        error ? controlStyles["control-error"] : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
