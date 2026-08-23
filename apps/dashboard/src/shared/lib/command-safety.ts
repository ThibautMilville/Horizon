import {parseConfigurationText} from "@/shared/lib/configuration";

export type CommandRiskLevel = "safe" | "caution" | "danger";

export type CommandRiskCode =
  | "destructive-delete"
  | "disk-write"
  | "privileged"
  | "remote-pipe"
  | "wide-permissions"
  | "sensitive-configuration"
  | "invalid-configuration";

export type CommandRiskFinding = {
  code: CommandRiskCode;
  level: Exclude<CommandRiskLevel, "safe">;
};

export type CommandSafetyAssessment = {
  level: CommandRiskLevel;
  findings: CommandRiskFinding[];
  requiresAcknowledgement: boolean;
};

const DISK_WRITE_PATTERN = /(?:\bmkfs(?:\.[a-z0-9]+)?\b|\bdd\s+[^\n]*\bof=\/dev\/)/i;
const REMOTE_PIPE_PATTERN = /\b(?:curl|wget)\b[^\n|]*\|\s*(?:sh|bash)\b/i;
const PRIVILEGED_PATTERN = /\bsudo\b/i;
const WIDE_PERMISSIONS_PATTERN = /\bchmod\s+(?:-R\s+)?777\b/i;
const SENSITIVE_KEY_PATTERN = /(api[-_]?key|token|secret|password|credential)/i;

function hasDestructiveDelete(script: string): boolean {
  return script.split(/[\n;&]/).some((statement) => {
    if (!/\brm\b/i.test(statement)) {
      return false;
    }

    const shortFlags = [...statement.matchAll(/(?:^|\s)-([a-z]+)/gi)].map((match) => match[1]);
    const recursive =
      shortFlags.some((flags) => flags.includes("r")) || /--recursive\b/i.test(statement);
    const forced = shortFlags.some((flags) => flags.includes("f")) || /--force\b/i.test(statement);
    const broadTarget =
      /(?:^|\s)["']?(?:\/|~(?:\/|\s|$)|\.{1,2}(?:\/|\s|$)|\*|\$\{?[a-z_][a-z0-9_]*\}?)/i.test(
        statement,
      );

    return recursive && forced && broadTarget;
  });
}

function hasSensitiveConfiguration(value: unknown): boolean {
  if (!value || typeof value !== "object") {
    return false;
  }

  return Object.entries(value).some(([key, nested]) => {
    if (SENSITIVE_KEY_PATTERN.test(key) && nested !== null && nested !== "") {
      return true;
    }
    return hasSensitiveConfiguration(nested);
  });
}

export function reviewCommandSafety(
  executionScript: string,
  configurationText: string,
): CommandSafetyAssessment {
  const findings: CommandRiskFinding[] = [];
  const add = (code: CommandRiskCode, level: CommandRiskFinding["level"]) => {
    findings.push({code, level});
  };

  if (hasDestructiveDelete(executionScript)) {
    add("destructive-delete", "danger");
  }
  if (DISK_WRITE_PATTERN.test(executionScript)) {
    add("disk-write", "danger");
  }
  if (REMOTE_PIPE_PATTERN.test(executionScript)) {
    add("remote-pipe", "danger");
  }
  if (PRIVILEGED_PATTERN.test(executionScript)) {
    add("privileged", "danger");
  }
  if (WIDE_PERMISSIONS_PATTERN.test(executionScript)) {
    add("wide-permissions", "caution");
  }

  const configuration = parseConfigurationText(configurationText);
  if (!configuration.ok) {
    add("invalid-configuration", "danger");
  } else if (hasSensitiveConfiguration(configuration.value)) {
    add("sensitive-configuration", "caution");
  }

  const level = findings.some((finding) => finding.level === "danger")
    ? "danger"
    : findings.length > 0
      ? "caution"
      : "safe";

  return {
    level,
    findings,
    requiresAcknowledgement: level === "danger",
  };
}
