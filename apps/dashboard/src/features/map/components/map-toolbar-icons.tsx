import {SvgIcon} from "@/shared/ui/actions/SvgIcon";

type IconProps = {
  className?: string;
};

export function ZoomInIcon({className}: IconProps) {
  return (
    <SvgIcon className={className} size={18} viewBox="0 0 18 18">
      <circle cx="8" cy="8" r="5.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 5.6v4.8M5.6 8h4.8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <path d="m12.2 12.2 3.1 3.1" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </SvgIcon>
  );
}

export function ZoomOutIcon({className}: IconProps) {
  return (
    <SvgIcon className={className} size={18} viewBox="0 0 18 18">
      <circle cx="8" cy="8" r="5.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5.6 8h4.8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      <path d="m12.2 12.2 3.1 3.1" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </SvgIcon>
  );
}

export function FitViewIcon({className}: IconProps) {
  return (
    <SvgIcon className={className} size={18} viewBox="0 0 18 18">
      <path
        d="M4 7.2V4h3.2M10.8 4H14v3.2M14 10.8V14h-3.2M7.2 14H4v-3.2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </SvgIcon>
  );
}

export function SatelliteIcon({className}: IconProps) {
  return (
    <SvgIcon className={className} size={18} viewBox="0 0 18 18">
      <rect
        height="4.4"
        rx="0.9"
        stroke="currentColor"
        strokeWidth="1.4"
        transform="rotate(45 9 9)"
        width="4.4"
        x="6.8"
        y="6.8"
      />
      <path
        d="M3.4 3.4 6.4 6.4M11.6 11.6l3 3M3.4 14.6 6.4 11.6M11.6 6.4l3-3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.4"
      />
    </SvgIcon>
  );
}

export function StationIcon({className}: IconProps) {
  return (
    <SvgIcon className={className} size={18} viewBox="0 0 18 18">
      <path d="M9 14.5V9.2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      <path
        d="M4.5 9.4a4.5 4.5 0 0 1 9 0"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.4"
      />
      <path
        d="M2.6 7.4a6.4 6.4 0 0 1 12.8 0"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.4"
      />
      <circle cx="9" cy="9.2" fill="currentColor" r="1.2" />
    </SvgIcon>
  );
}

export function TrackIcon({className}: IconProps) {
  return (
    <SvgIcon className={className} size={18} viewBox="0 0 18 18">
      <path
        d="M3 12.5c2.2-4.8 4.2-7 6-7s3.8 2.2 6 7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <circle cx="9" cy="5.5" fill="currentColor" r="1.35" />
    </SvgIcon>
  );
}

export function DayNightIcon({className}: IconProps) {
  return (
    <SvgIcon className={className} size={18} viewBox="0 0 18 18">
      <circle cx="9" cy="9" r="6.1" stroke="currentColor" strokeWidth="1.4" />
      <path d="M9 2.9v12.2" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M9 2.9a6.1 6.1 0 0 1 0 12.2"
        fill="currentColor"
        fillOpacity="0.35"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </SvgIcon>
  );
}

export function BasemapIcon({className}: IconProps) {
  return (
    <SvgIcon className={className} size={18} viewBox="0 0 18 18">
      <path
        d="M3.2 5.2 9 2.8l5.8 2.4v7.6L9 15.2l-5.8-2.4V5.2Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.4"
      />
      <path d="M9 2.8v12.4M3.2 5.2 9 7.4l5.8-2.2" stroke="currentColor" strokeWidth="1.3" />
    </SvgIcon>
  );
}

export function InfoBarIcon({className}: IconProps) {
  return (
    <SvgIcon className={className} size={18} viewBox="0 0 18 18">
      <circle cx="9" cy="9" r="6.1" stroke="currentColor" strokeWidth="1.4" />
      <path d="M9 7.85v4.1" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      <circle cx="9" cy="5.55" fill="currentColor" r="0.95" />
    </SvgIcon>
  );
}

export function WorldViewIcon({className}: IconProps) {
  return (
    <SvgIcon className={className} size={18} viewBox="0 0 18 18">
      <circle cx="9" cy="9" r="6.1" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M3.2 9h11.6M9 2.9c1.7 1.8 2.6 3.9 2.6 6.1S10.7 13.3 9 15.1M9 2.9C7.3 4.7 6.4 6.8 6.4 9s.9 4.4 2.6 6.1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.3"
      />
    </SvgIcon>
  );
}

export function FocusTrackIcon({className}: IconProps) {
  return (
    <SvgIcon className={className} size={18} viewBox="0 0 18 18">
      <circle cx="9" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M9 2.4v2.2M9 13.4v2.2M2.4 9h2.2M13.4 9h2.2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.4"
      />
    </SvgIcon>
  );
}

export function ContactPassIcon({className}: IconProps) {
  return (
    <SvgIcon className={className} size={18} viewBox="0 0 18 18">
      <path
        d="M4.2 12.4V7.8M4.2 7.8c0-2.5 2-4.4 4.5-4.4s4.5 1.9 4.5 4.4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.4"
      />
      <path
        d="M13.2 10.2c.9.4 1.5 1.3 1.5 2.3 0 1.4-1.2 2.5-2.6 2.5H6.4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.4"
      />
      <circle cx="4.2" cy="12.4" fill="currentColor" r="1.1" />
    </SvgIcon>
  );
}
