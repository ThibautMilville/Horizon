import type {DomainIconName} from "@/shared/ui/actions/DomainIcon";
import type {MessageKey} from "@/shared/i18n/messages";

type ShellNavItem = {
  to: string;
  labelKey: MessageKey;
  icon: DomainIconName;
};

export const shellNav: ShellNavItem[] = [
  {to: "/map", labelKey: "nav.map", icon: "map"},
  {to: "/fleet", labelKey: "nav.fleet", icon: "fleet"},
  {to: "/constellations", labelKey: "nav.constellations", icon: "constellations"},
  {to: "/payloads", labelKey: "nav.payloads", icon: "payloads"},
  {to: "/satellites", labelKey: "nav.satellites", icon: "satellites"},
  {to: "/stations", labelKey: "nav.stations", icon: "stations"},
  {to: "/contacts", labelKey: "nav.contacts", icon: "contacts"},
  {to: "/reports", labelKey: "nav.reports", icon: "reports"},
  {to: "/customers", labelKey: "nav.customers", icon: "customers"},
];

export function isImmersiveShell(pathname: string): boolean {
  return pathname === "/" || pathname === "/map" || pathname.startsWith("/map/");
}
