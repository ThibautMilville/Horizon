import {describe, expect, it} from "vitest";

import {emptyContactFormValues} from "./contact-form-values";
import {buildContactMutationInput} from "./contact-input";

const validValues = {
  ...emptyContactFormValues,
  date: "2026-08-21T12:00",
  executionScript: "echo ready",
  groundStation_id: "station-1",
  satellite_id: "satellite-1",
  employee_id: "employee-1",
};

describe("buildContactMutationInput", () => {
  it("normalizes form values for GraphQL mutations", () => {
    expect(buildContactMutationInput(validValues)).toEqual({
      ok: true,
      value: {
        date: "2026-08-21T12:00:00.000Z",
        type: "Customer Task",
        executionScript: "echo ready",
        configuration: {},
        groundStation_id: "station-1",
        satellite_id: "satellite-1",
        payload_id: null,
        employee_id: "employee-1",
      },
    });
  });

  it.each([
    ["invalid JSON", "{", "configuration-json"],
    ["non-object JSON", "[]", "configuration-object"],
  ])("rejects %s", (_label, configurationText, error) => {
    expect(buildContactMutationInput({...validValues, configurationText})).toEqual({
      ok: false,
      error,
    });
  });

  it("rejects invalid dates", () => {
    expect(buildContactMutationInput({...validValues, date: "tomorrow"})).toEqual({
      ok: false,
      error: "date",
    });
  });

  it.each([
    ["type", {type: ""}, "type"],
    ["execution script", {executionScript: ""}, "execution-script"],
    ["ground station", {groundStation_id: ""}, "ground-station"],
    ["satellite", {satellite_id: ""}, "satellite"],
    ["operator", {employee_id: ""}, "employee"],
  ])("rejects a missing %s", (_label, overrides, error) => {
    expect(buildContactMutationInput({...validValues, ...overrides})).toEqual({
      ok: false,
      error,
    });
  });

  it("supports the map planner execution-script default", () => {
    const result = buildContactMutationInput(
      {...validValues, executionScript: ""},
      {defaultExecutionScript: "pass"},
    );

    expect(result.ok && result.value.executionScript).toBe("pass");
  });
});
