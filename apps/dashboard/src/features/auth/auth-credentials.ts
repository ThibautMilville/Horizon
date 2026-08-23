export type SessionUser = {
  username: string;
  displayName: string;
  handle: string;
  email: string;
  role: string;
  organization: string;
  timezone: string;
  badge: string;
  avatarUrl: string;
  signedInAt: string;
};

export const DEMO_USERNAME = "Commander";
export const DEMO_PASSWORD = "commander";
const DEMO_AVATAR_URL = "/commander.webp";

export function buildDemoUser(signedInAt = new Date().toISOString()): SessionUser {
  return {
    username: DEMO_USERNAME,
    displayName: "Commander",
    handle: "commander",
    email: "commander@horizon.ops",
    role: "Fleet operator",
    organization: "Horizon Mission Ops",
    timezone: "UTC",
    badge: "Lead controller",
    avatarUrl: DEMO_AVATAR_URL,
    signedInAt,
  };
}

export function authenticate(username: string, password: string): SessionUser | null {
  if (username !== DEMO_USERNAME || password !== DEMO_PASSWORD) {
    return null;
  }

  return buildDemoUser();
}

export function formatSignedInAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  const pad = (part: number) => String(part).padStart(2, "0");
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())} UTC`;
}
