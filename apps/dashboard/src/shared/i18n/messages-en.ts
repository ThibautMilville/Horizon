import {auth_en} from "./locales/en/auth";
import {common_en} from "./locales/en/common";
import {constellations_en} from "./locales/en/constellations";
import {contacts_en} from "./locales/en/contacts";
import {customers_en} from "./locales/en/customers";
import {fleet_en} from "./locales/en/fleet";
import {map_en} from "./locales/en/map";
import {nav_en} from "./locales/en/nav";
import {payloads_en} from "./locales/en/payloads";
import {prefs_en} from "./locales/en/prefs";
import {reports_en} from "./locales/en/reports";
import {satellites_en} from "./locales/en/satellites";
import {search_en} from "./locales/en/search";
import {shell_en} from "./locales/en/shell";
import {space_weather_en} from "./locales/en/space-weather";
import {stations_en} from "./locales/en/stations";

export const messagesEn = {
  ...auth_en,
  ...common_en,
  ...constellations_en,
  ...contacts_en,
  ...customers_en,
  ...fleet_en,
  ...map_en,
  ...nav_en,
  ...payloads_en,
  ...prefs_en,
  ...reports_en,
  ...satellites_en,
  ...search_en,
  ...shell_en,
  ...space_weather_en,
  ...stations_en,
} as const;

export type MessageKey = keyof typeof messagesEn;
export type MessageDict = Record<MessageKey, string>;
