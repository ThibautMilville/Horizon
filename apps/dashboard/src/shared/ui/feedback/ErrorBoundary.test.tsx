import {render, screen} from "@testing-library/react";
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";

import {ErrorBoundary} from "./ErrorBoundary";

function BrokenContent(): never {
  throw new Error("render failed");
}

describe("ErrorBoundary", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders its fallback after a child render failure", () => {
    render(
      <ErrorBoundary fallback={<p>Page unavailable</p>}>
        <BrokenContent />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Page unavailable")).toBeInTheDocument();
  });
});
