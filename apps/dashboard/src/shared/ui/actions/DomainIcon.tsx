import {MapIcon} from "./action-icons";
import {SvgIcon} from "./SvgIcon";

export type DomainIconName =
  | "fleet"
  | "map"
  | "constellations"
  | "satellites"
  | "payloads"
  | "customers"
  | "contacts"
  | "stations"
  | "reports";

type DomainIconProps = {
  name: DomainIconName;
};

export function DomainIcon({name}: DomainIconProps) {
  switch (name) {
    case "fleet":
      return (
        <SvgIcon>
          <circle cx="8" cy="8" r="1.35" fill="currentColor" />
          <circle cx="3.2" cy="4.2" r="1.1" stroke="currentColor" strokeWidth="1.25" />
          <circle cx="12.8" cy="4.2" r="1.1" stroke="currentColor" strokeWidth="1.25" />
          <circle cx="3.2" cy="11.8" r="1.1" stroke="currentColor" strokeWidth="1.25" />
          <circle cx="12.8" cy="11.8" r="1.1" stroke="currentColor" strokeWidth="1.25" />
          <path
            d="M4.2 4.8 6.9 7.2M11.8 4.8 9.1 7.2M4.2 11.2 6.9 8.8M11.8 11.2 9.1 8.8"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.2"
          />
        </SvgIcon>
      );
    case "map":
      return <MapIcon />;
    case "constellations":
      return (
        <SvgIcon>
          <path
            d="M2.6 11.1 4.7 5.9 8 8.6 11.3 5.9 13.4 11.1"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.15"
          />
          <circle cx="2.6" cy="11.1" fill="currentColor" r="0.9" />
          <circle cx="4.7" cy="5.9" fill="currentColor" r="0.75" />
          <circle cx="8" cy="8.6" fill="currentColor" r="1" />
          <circle cx="11.3" cy="5.9" fill="currentColor" r="0.75" />
          <circle cx="13.4" cy="11.1" fill="currentColor" r="0.9" />
        </SvgIcon>
      );
    case "satellites":
      return (
        <SvgIcon>
          <ellipse
            cx="8"
            cy="8"
            rx="6.1"
            ry="2.35"
            stroke="currentColor"
            strokeWidth="1.25"
            transform="rotate(-28 8 8)"
          />
          <ellipse
            cx="8"
            cy="8"
            rx="6.1"
            ry="2.35"
            stroke="currentColor"
            strokeWidth="1.25"
            transform="rotate(38 8 8)"
          />
          <circle cx="8" cy="8" fill="currentColor" r="1.45" />
        </SvgIcon>
      );
    case "payloads":
      return (
        <SvgIcon>
          <path
            d="M8 2.2 13.2 5.1v5.8L8 13.8 2.8 10.9V5.1L8 2.2Z"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="1.3"
          />
          <path d="M8 2.2V8m0 0 5.2 2.9M8 8 2.8 10.9" stroke="currentColor" strokeWidth="1.2" />
        </SvgIcon>
      );
    case "customers":
      return (
        <SvgIcon>
          <path
            d="M2.8 13.2V6.4L8 2.8l5.2 3.6v6.8"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="1.3"
          />
          <path
            d="M6.1 13.2V9.1h3.8v4.1"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="1.25"
          />
          <path d="M4.4 7.4h1.3M10.3 7.4h1.3M4.4 9.6h1.3" stroke="currentColor" strokeWidth="1.2" />
        </SvgIcon>
      );
    case "contacts":
      return (
        <SvgIcon>
          <rect
            height="11.2"
            rx="1.2"
            stroke="currentColor"
            strokeWidth="1.3"
            width="11.2"
            x="2.4"
            y="2.8"
          />
          <path
            d="M2.4 5.8h11.2M5.4 2.8V1.7M10.6 2.8V1.7"
            stroke="currentColor"
            strokeWidth="1.25"
          />
          <path
            d="M5.2 8.2h2.1M5.2 10.6h5.2"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.25"
          />
        </SvgIcon>
      );
    case "stations":
      return (
        <SvgIcon>
          <path d="M8 13.4V7.2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.4" />
          <path
            d="M5.1 5.2a3.2 3.2 0 0 1 5.8 0"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.3"
          />
          <path
            d="M3.4 3.5a5.1 5.1 0 0 1 9.2 0"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.3"
          />
          <path d="M6.6 13.4h2.8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.4" />
          <circle cx="8" cy="7.1" fill="currentColor" r="1.05" />
        </SvgIcon>
      );
    case "reports":
      return (
        <SvgIcon>
          <path
            d="M3.1 9.2h9.8v3.4a1.2 1.2 0 0 1-1.2 1.2H4.3a1.2 1.2 0 0 1-1.2-1.2V9.2Z"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="1.3"
          />
          <path
            d="M4.6 9.2V5.4l3.4-2.2 3.4 2.2v3.8"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="1.3"
          />
          <path d="M8 7.6v4.2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.25" />
        </SvgIcon>
      );
  }
}
