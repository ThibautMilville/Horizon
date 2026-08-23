import {act, renderHook} from "@testing-library/react";
import type {ReactNode} from "react";
import {MemoryRouter, useLocation} from "react-router-dom";
import {describe, expect, it} from "vitest";

import {useSearchParamState} from "./useSearchParamState";

const FILTERS = ["", "active", "inactive"] as const;

function wrapper({children}: {children: ReactNode}) {
  return <MemoryRouter initialEntries={["/?page=2&status=unknown"]}>{children}</MemoryRouter>;
}

describe("useSearchParamState", () => {
  it("falls back for invalid values and preserves unrelated parameters", () => {
    const {result} = renderHook(
      () => {
        const [status, setStatus] = useSearchParamState("status", FILTERS, "");
        return {location: useLocation(), setStatus, status};
      },
      {wrapper},
    );

    expect(result.current.status).toBe("");

    act(() => result.current.setStatus("active"));
    expect(result.current.status).toBe("active");
    expect(result.current.location.search).toBe("?page=2&status=active");

    act(() => result.current.setStatus(""));
    expect(result.current.location.search).toBe("?page=2");
  });
});
