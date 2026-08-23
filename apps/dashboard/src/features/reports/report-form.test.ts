import {describe, expect, it} from "vitest";

import {
  buildCommentMutationInput,
  buildReportMutationInput,
  emptyCommentFormValues,
  emptyReportFormValues,
  toOptionalAssetId,
} from "./report-form";

const validReport = {
  ...emptyReportFormValues,
  date: "2026-08-21T12:00",
  title: "Pass anomaly",
  content: "Unexpected telemetry",
  employee_id: "employee-1",
};

const validComment = {
  ...emptyCommentFormValues,
  date: "2026-08-21T12:00",
  content: "Investigating",
  employee_id: "employee-1",
};

describe("toOptionalAssetId", () => {
  it("maps blank strings to null", () => {
    expect(toOptionalAssetId("")).toBeNull();
    expect(toOptionalAssetId("  ")).toBeNull();
    expect(toOptionalAssetId("abc")).toBe("abc");
  });
});

describe("buildReportMutationInput", () => {
  it("normalizes a valid report", () => {
    expect(buildReportMutationInput(validReport)).toEqual({
      ok: true,
      value: {
        type: "Issue",
        date: "2026-08-21T12:00:00.000Z",
        title: "Pass anomaly",
        content: "Unexpected telemetry",
        employee_id: "employee-1",
        satellite_id: null,
        groundStation_id: null,
      },
    });
  });

  it.each([
    ["date", {date: ""}, "date"],
    ["type", {type: ""}, "type"],
    ["title", {title: "  "}, "title"],
    ["content", {content: ""}, "content"],
    ["author", {employee_id: ""}, "employee"],
  ])("rejects a missing %s", (_label, overrides, error) => {
    expect(buildReportMutationInput({...validReport, ...overrides})).toEqual({ok: false, error});
  });
});

describe("buildCommentMutationInput", () => {
  it("normalizes a valid comment", () => {
    expect(buildCommentMutationInput(validComment, "report-1")).toEqual({
      ok: true,
      value: {
        date: "2026-08-21T12:00:00.000Z",
        content: "Investigating",
        report_id: "report-1",
        employee_id: "employee-1",
      },
    });
  });

  it.each([
    ["date", {date: ""}, "date"],
    ["content", {content: ""}, "content"],
    ["author", {employee_id: ""}, "employee"],
  ])("rejects a missing %s", (_label, overrides, error) => {
    expect(buildCommentMutationInput({...validComment, ...overrides}, "report-1")).toEqual({
      ok: false,
      error,
    });
  });
});
