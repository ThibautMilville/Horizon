import {describe, expect, it} from "vitest";

import {contactToFormValues, emptyContactFormValues} from "./contact-form-values";

describe("contactToFormValues", () => {
  it("hydrates editable values from a contact", () => {
    expect(
      contactToFormValues({
        date: "2026-08-21T12:00:00.000Z",
        type: "Customer Task",
        executionScript: "pass",
        configuration: {mode: "safe"},
        groundStation_id: "station-1",
        satellite_id: "satellite-1",
        payload_id: null,
        employee_id: "employee-1",
      }),
    ).toEqual({
      ...emptyContactFormValues,
      date: "2026-08-21T12:00",
      type: "Customer Task",
      executionScript: "pass",
      configurationText: '{\n  "mode": "safe"\n}\n',
      groundStation_id: "station-1",
      satellite_id: "satellite-1",
      employee_id: "employee-1",
    });
  });
});
