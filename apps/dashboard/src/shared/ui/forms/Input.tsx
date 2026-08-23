import type {InputHTMLAttributes} from "react";

import controlStyles from "./control.module.scss";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
  tone?: "default" | "soft";
};

export function Input({className = "", error = false, tone = "default", ...props}: InputProps) {
  return (
    <input
      {...props}
      aria-invalid={error || props["aria-invalid"] ? true : undefined}
      className={[
        controlStyles.control,
        tone === "soft" ? controlStyles.soft : "",
        error ? controlStyles["control-error"] : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
