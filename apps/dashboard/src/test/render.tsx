import {MockedProvider, type MockedResponse} from "@apollo/client/testing";
import {render, type RenderResult} from "@testing-library/react";
import type {ReactNode} from "react";
import {MemoryRouter} from "react-router-dom";

import {AuthProvider} from "@/features/auth/AuthProvider";
import {PreferencesProvider} from "@/shared/preferences/PreferencesProvider";
import {ToastProvider} from "@/shared/ui/feedback/ToastProvider";

export function renderApp(
  children: ReactNode,
  options: {
    route?: string | {pathname: string; state?: unknown};
    mocks?: MockedResponse[];
  } = {},
): RenderResult {
  return render(
    <MockedProvider addTypename={false} mocks={options.mocks ?? []}>
      <MemoryRouter initialEntries={[options.route ?? "/"]}>
        <AuthProvider>
          <ToastProvider>
            <PreferencesProvider>{children}</PreferencesProvider>
          </ToastProvider>
        </AuthProvider>
      </MemoryRouter>
    </MockedProvider>,
  );
}
