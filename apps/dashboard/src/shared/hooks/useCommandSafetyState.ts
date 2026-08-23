import {useCallback, useMemo, useState} from "react";

import {reviewCommandSafety} from "@/shared/lib/command-safety";

type ScriptFields = {
  executionScript: string;
  configurationText: string;
};

export function useCommandSafetyState(executionScript: string, configurationText: string) {
  const [safetyAcknowledged, setSafetyAcknowledged] = useState(false);
  const safety = useMemo(
    () => reviewCommandSafety(executionScript, configurationText),
    [configurationText, executionScript],
  );

  const resetSafetyAcknowledgement = useCallback(() => {
    setSafetyAcknowledged(false);
  }, []);

  const onScriptOrConfigChange = useCallback((next: ScriptFields, current: ScriptFields) => {
    if (
      next.executionScript !== current.executionScript ||
      next.configurationText !== current.configurationText
    ) {
      setSafetyAcknowledged(false);
    }
  }, []);

  return {
    safety,
    safetyAcknowledged,
    setSafetyAcknowledged,
    resetSafetyAcknowledgement,
    safetyBlocked: safety.requiresAcknowledgement && !safetyAcknowledged,
    onScriptOrConfigChange,
  };
}
