import type {ReactElement, ReactNode} from "react";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {describe, expect, it, vi} from "vitest";

import {PreferencesProvider} from "@/shared/preferences/PreferencesProvider";
import {ToastProvider} from "@/shared/ui/feedback/ToastProvider";

import {LoadableContent} from "./LoadableContent";

function Providers({children}: {children: ReactNode}) {
  return (
    <ToastProvider>
      <PreferencesProvider>{children}</PreferencesProvider>
    </ToastProvider>
  );
}

function renderLoadable(ui: ReactElement) {
  return render(ui, {wrapper: Providers});
}

const baseProps = {
  errorTitle: "Load failed",
  loading: false,
  onRetry: vi.fn(),
  retryLabel: "Retry",
};

describe("LoadableContent", () => {
  it("prioritizes errors and exposes retry", async () => {
    const onRetry = vi.fn();
    renderLoadable(
      <LoadableContent {...baseProps} errorMessage="Unavailable" loading onRetry={onRetry}>
        Content
      </LoadableContent>,
    );

    expect(screen.getByText("Unavailable")).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", {name: "Retry"}));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("renders skeleton loading and empty states", async () => {
    const {rerender} = renderLoadable(<LoadableContent {...baseProps}>Content</LoadableContent>);
    expect(screen.getByText("Content")).toBeInTheDocument();

    rerender(
      <Providers>
        <LoadableContent {...baseProps} loading>
          Content
        </LoadableContent>
      </Providers>,
    );
    expect(screen.queryByText("Content")).not.toBeInTheDocument();
    expect(await screen.findByRole("status")).toHaveAttribute("aria-busy", "true");

    rerender(
      <Providers>
        <LoadableContent {...baseProps} empty emptyMessage="No result">
          Content
        </LoadableContent>
      </Providers>,
    );
    expect(screen.getByText("No result")).toBeInTheDocument();
  });
});
