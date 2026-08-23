import type {ReactNode, SVGProps} from "react";

type SvgIconProps = {
  children: ReactNode;
  size?: number;
  viewBox?: string;
} & Omit<SVGProps<SVGSVGElement>, "children" | "height" | "viewBox" | "width">;

export function SvgIcon({children, size = 16, viewBox = "0 0 16 16", ...props}: SvgIconProps) {
  return (
    <svg aria-hidden="true" fill="none" height={size} viewBox={viewBox} width={size} {...props}>
      {children}
    </svg>
  );
}
