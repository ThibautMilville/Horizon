import {describe, expect, it} from "vitest";

import {authenticate, DEMO_PASSWORD, DEMO_USERNAME, formatSignedInAt} from "./auth-credentials";
import {clearSession, readSession, writeSession} from "./auth-session";

describe("authenticate", () => {
  it("accepts the demo Commander credentials", () => {
    const user = authenticate(DEMO_USERNAME, DEMO_PASSWORD);
    expect(user).toMatchObject({
      username: "Commander",
      displayName: "Commander",
      handle: "commander",
      email: "commander@horizon.ops",
      role: "Fleet operator",
      avatarUrl: "/commander.webp",
    });
    expect(user?.signedInAt).toBeTruthy();
  });

  it("rejects invalid credentials", () => {
    expect(authenticate("Commander", "wrong")).toBeNull();
    expect(authenticate("Other", DEMO_PASSWORD)).toBeNull();
  });
});

describe("formatSignedInAt", () => {
  it("formats a UTC timestamp", () => {
    expect(formatSignedInAt("2024-11-13T01:43:00.000Z")).toBe("2024-11-13 01:43 UTC");
  });
});

describe("auth session storage", () => {
  it("round-trips a session in storage", () => {
    const user = authenticate(DEMO_USERNAME, DEMO_PASSWORD);
    expect(user).not.toBeNull();
    writeSession(user!);
    expect(readSession()?.username).toBe("Commander");
    clearSession();
    expect(readSession()).toBeNull();
  });

  it("rejects invalid session payloads", () => {
    localStorage.setItem("horizon.auth.session", "{");
    expect(readSession()).toBeNull();

    localStorage.setItem("horizon.auth.session", JSON.stringify({username: "Commander"}));
    expect(readSession()).toBeNull();

    localStorage.setItem(
      "horizon.auth.session",
      JSON.stringify({
        username: "operator",
        displayName: "Operator",
        handle: "ops",
      }),
    );
    expect(readSession()).toBeNull();
  });
});
