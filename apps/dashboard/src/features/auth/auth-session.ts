import {buildDemoUser, type SessionUser} from "./auth-credentials";

const AUTH_SESSION_KEY = "horizon.auth.session";

export function readSession(storage: Storage = localStorage): SessionUser | null {
  try {
    const raw = storage.getItem(AUTH_SESSION_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<SessionUser>;
    if (typeof parsed.username !== "string" || typeof parsed.displayName !== "string") {
      return null;
    }

    if (parsed.username === "Commander") {
      return {
        ...buildDemoUser(
          typeof parsed.signedInAt === "string" ? parsed.signedInAt : new Date().toISOString(),
        ),
        displayName: parsed.displayName,
        handle: typeof parsed.handle === "string" ? parsed.handle : "commander",
      };
    }

    if (
      typeof parsed.handle !== "string" ||
      typeof parsed.email !== "string" ||
      typeof parsed.role !== "string" ||
      typeof parsed.organization !== "string" ||
      typeof parsed.timezone !== "string" ||
      typeof parsed.badge !== "string" ||
      typeof parsed.signedInAt !== "string"
    ) {
      return null;
    }

    return {
      username: parsed.username,
      displayName: parsed.displayName,
      handle: parsed.handle,
      email: parsed.email,
      role: parsed.role,
      organization: parsed.organization,
      timezone: parsed.timezone,
      badge: parsed.badge,
      avatarUrl: typeof parsed.avatarUrl === "string" ? parsed.avatarUrl : "",
      signedInAt: parsed.signedInAt,
    };
  } catch {
    return null;
  }
}

export function writeSession(user: SessionUser, storage: Storage = localStorage): void {
  storage.setItem(AUTH_SESSION_KEY, JSON.stringify(user));
}

export function clearSession(storage: Storage = localStorage): void {
  storage.removeItem(AUTH_SESSION_KEY);
}
