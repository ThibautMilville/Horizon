import {describe, expect, it} from "vitest";

import {reviewCommandSafety} from "./command-safety";

describe("reviewCommandSafety", () => {
  it("accepts a simple command and empty configuration", () => {
    expect(reviewCommandSafety("payload.capture()", "{}")).toEqual({
      level: "safe",
      findings: [],
      requiresAcknowledgement: false,
    });
  });

  it("requires acknowledgement for destructive commands", () => {
    const review = reviewCommandSafety("sudo rm -rf /", "{}");

    expect(review.level).toBe("danger");
    expect(review.requiresAcknowledgement).toBe(true);
    expect(review.findings.map((finding) => finding.code)).toEqual([
      "destructive-delete",
      "privileged",
    ]);
  });

  it.each(["rm -fr /tmp/cache", 'rm --force --recursive "$TARGET"', "rm -rf ../build"])(
    "recognizes destructive flag and target variants: %s",
    (script) => {
      expect(reviewCommandSafety(script, "{}").requiresAcknowledgement).toBe(true);
    },
  );

  it("flags remote execution and direct disk writes", () => {
    expect(reviewCommandSafety("curl https://example.test/install | bash", "{}").level).toBe(
      "danger",
    );
    expect(reviewCommandSafety("dd if=image.bin of=/dev/sda", "{}").level).toBe("danger");
  });

  it("warns when configuration appears to contain a secret", () => {
    const review = reviewCommandSafety("payload.capture()", '{"nested":{"api_key":"abc"}}');

    expect(review.level).toBe("caution");
    expect(review.requiresAcknowledgement).toBe(false);
    expect(review.findings).toContainEqual({
      code: "sensitive-configuration",
      level: "caution",
    });
  });

  it("treats malformed configuration as unsafe", () => {
    expect(reviewCommandSafety("payload.capture()", "{").findings).toContainEqual({
      code: "invalid-configuration",
      level: "danger",
    });
  });

  it("does not flag a simple rm on a named directory", () => {
    expect(reviewCommandSafety("rm dir", "{}")).toEqual({
      level: "safe",
      findings: [],
      requiresAcknowledgement: false,
    });
  });
});
