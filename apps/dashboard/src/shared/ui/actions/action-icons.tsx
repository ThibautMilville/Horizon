import {SvgIcon} from "./SvgIcon";

type IconProps = {
  className?: string;
};

export function CloseIcon({className, size = 16}: IconProps & {size?: number}) {
  return (
    <SvgIcon className={className} size={size}>
      <path
        d="m4.2 4.2 7.6 7.6M11.8 4.2 4.2 11.8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </SvgIcon>
  );
}

export function SearchIcon({className, size = 16}: IconProps & {size?: number}) {
  return (
    <SvgIcon className={className} size={size}>
      <circle cx="7" cy="7" r="4.2" stroke="currentColor" strokeWidth="1.45" />
      <path d="m10.2 10.2 3.1 3.1" stroke="currentColor" strokeLinecap="round" strokeWidth="1.45" />
    </SvgIcon>
  );
}

export function ScheduleIcon({className}: IconProps) {
  return (
    <SvgIcon className={className}>
      <rect
        height="10.2"
        rx="1.4"
        stroke="currentColor"
        strokeWidth="1.35"
        width="11.2"
        x="2.4"
        y="3.4"
      />
      <path
        d="M5.2 2.2v2.4M10.8 2.2v2.4M2.4 6.4h11.2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.35"
      />
      <path d="M6 9.2h4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.35" />
    </SvgIcon>
  );
}

export function ArrowLeftIcon({className}: IconProps) {
  return (
    <SvgIcon className={className}>
      <path
        d="M9.8 3.8 5.6 8l4.2 4.2M5.8 8h6.4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </SvgIcon>
  );
}

export function ChevronDownIcon({className, size = 16}: IconProps & {size?: number}) {
  return (
    <SvgIcon className={className} size={size}>
      <path
        d="M4.2 6.2 8 9.8l3.8-3.6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.45"
      />
    </SvgIcon>
  );
}

export function DocumentPlusIcon({className}: IconProps) {
  return (
    <SvgIcon className={className}>
      <path
        d="M4.2 2.4h5.2L11.8 4.8v8.8H4.2z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.35"
      />
      <path d="M9.2 2.5V5h2.6" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.35" />
      <path
        d="M8 7.4v3.2M6.4 9h3.2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.35"
      />
    </SvgIcon>
  );
}

export function SatelliteIcon({className}: IconProps) {
  return (
    <SvgIcon className={className}>
      <rect
        height="3.6"
        rx="0.7"
        stroke="currentColor"
        strokeWidth="1.3"
        transform="rotate(45 8 8)"
        width="3.6"
        x="6.2"
        y="6.2"
      />
      <path
        d="M4.2 6.2 2.8 4.8M11.8 9.8l1.4 1.4M6.2 4.2 4.8 2.8M9.8 11.8l1.4 1.4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.25"
      />
    </SvgIcon>
  );
}

export function MapIcon({className}: IconProps) {
  return (
    <SvgIcon className={className}>
      <path
        d="M2.2 3.4 5.8 2.3l4.2 1.2 3.8-1.1v10.3l-3.8 1.1-4.2-1.2-3.6 1.1V3.4Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.35"
      />
      <path d="M5.8 2.4v10.1M10 3.5v10.1" stroke="currentColor" strokeWidth="1.2" />
    </SvgIcon>
  );
}

export function AttentionIcon({className}: IconProps) {
  return (
    <SvgIcon className={className}>
      <path
        d="M8 2.4 14.1 13H1.9L8 2.4Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.35"
      />
      <path d="M8 6.2v3.2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.4" />
      <circle cx="8" cy="11.2" fill="currentColor" r="0.95" />
    </SvgIcon>
  );
}

export function ConfigIcon({className}: IconProps) {
  return (
    <SvgIcon className={className}>
      <circle cx="8" cy="8" r="2.1" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M8 1.8v1.5M8 12.7v1.5M1.8 8h1.5M12.7 8h1.5M3.4 3.4l1.1 1.1M11.5 11.5l1.1 1.1M12.6 3.4l-1.1 1.1M4.5 11.5l-1.1 1.1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.25"
      />
    </SvgIcon>
  );
}

export function InfoIcon({className}: IconProps) {
  return (
    <SvgIcon className={className} size={14}>
      <circle cx="8" cy="8" r="6.2" stroke="currentColor" strokeWidth="1.35" />
      <path d="M8 7.2v4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.4" />
      <circle cx="8" cy="5" fill="currentColor" r="0.95" />
    </SvgIcon>
  );
}

export function PlaceholderIcon({size = 22}: {size?: number}) {
  return (
    <SvgIcon size={size} viewBox="0 0 42 42">
      <circle cx="21" cy="21" r="18.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M16.4 16.2c.6-2.6 2.6-4.2 5.1-4.2 2.7 0 4.7 1.7 4.7 4.1 0 1.7-.8 2.8-2.5 3.8l-.7.4c-1 .6-1.4 1.2-1.4 2.3v1.1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <circle cx="21" cy="29.4" fill="currentColor" r="1.45" />
    </SvgIcon>
  );
}
