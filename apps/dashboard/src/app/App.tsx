import {ApolloProvider} from "@apollo/client";
import {Suspense, lazy, type ComponentType, type ReactNode} from "react";
import {BrowserRouter, Navigate, Route, Routes, useLocation} from "react-router-dom";

import {AppShell} from "@/app/AppShell";
import {apolloClient} from "@/app/apollo-client";
import {AuthProvider} from "@/features/auth/AuthProvider";
import {RequireAuth} from "@/features/auth/RequireAuth";
import {PreferencesProvider, useI18n} from "@/shared/preferences/PreferencesProvider";
import {Button, ButtonLink} from "@/shared/ui/actions/Button";
import {DelayedFallback} from "@/shared/ui/feedback/DelayedFallback";
import {ErrorBoundary} from "@/shared/ui/feedback/ErrorBoundary";
import {FullPageState} from "@/shared/ui/layout/FullPageState";
import {ToastProvider} from "@/shared/ui/feedback/ToastProvider";

function lazyRoute(loader: () => Promise<ComponentType>) {
  return lazy(async () => ({default: await loader()}));
}

const LoginPage = lazyRoute(async () => (await import("@/features/auth/LoginPage")).LoginPage);
const ForgotPasswordPage = lazyRoute(
  async () => (await import("@/features/auth/ForgotPasswordPage")).ForgotPasswordPage,
);
const ProfileRoute = lazyRoute(
  async () => (await import("@/features/auth/ProfileRoute")).ProfileRoute,
);
const NotFoundPage = lazyRoute(async () => (await import("@/app/NotFoundPage")).NotFoundPage);
const FleetMapRoute = lazyRoute(
  async () => (await import("@/features/map/FleetMapRoute")).FleetMapRoute,
);
const FleetRoute = lazyRoute(async () => (await import("@/features/fleet/FleetRoute")).FleetRoute);
const ConstellationOverviewRoute = lazyRoute(
  async () =>
    (await import("@/features/constellations/ConstellationOverviewRoute"))
      .ConstellationOverviewRoute,
);
const SatelliteListRoute = lazyRoute(
  async () => (await import("@/features/satellites/SatelliteListRoute")).SatelliteListRoute,
);
const SatelliteDetailRoute = lazyRoute(
  async () => (await import("@/features/satellites/SatelliteDetailRoute")).SatelliteDetailRoute,
);
const PayloadListRoute = lazyRoute(
  async () => (await import("@/features/payloads/PayloadListRoute")).PayloadListRoute,
);
const PayloadDetailRoute = lazyRoute(
  async () => (await import("@/features/payloads/PayloadDetailRoute")).PayloadDetailRoute,
);
const CustomerListRoute = lazyRoute(
  async () => (await import("@/features/customers/CustomerListRoute")).CustomerListRoute,
);
const CustomerDetailRoute = lazyRoute(
  async () => (await import("@/features/customers/CustomerDetailRoute")).CustomerDetailRoute,
);
const ContactListRoute = lazyRoute(
  async () => (await import("@/features/contacts/ContactListRoute")).ContactListRoute,
);
const ContactCreateRoute = lazyRoute(
  async () => (await import("@/features/contacts/ContactCreateRoute")).ContactCreateRoute,
);
const ContactDetailRoute = lazyRoute(
  async () => (await import("@/features/contacts/ContactDetailRoute")).ContactDetailRoute,
);
const StationListRoute = lazyRoute(
  async () => (await import("@/features/stations/StationListRoute")).StationListRoute,
);
const StationDetailRoute = lazyRoute(
  async () => (await import("@/features/stations/StationDetailRoute")).StationDetailRoute,
);
const ReportListRoute = lazyRoute(
  async () => (await import("@/features/reports/ReportListRoute")).ReportListRoute,
);
const ReportCreateRoute = lazyRoute(
  async () => (await import("@/features/reports/ReportCreateRoute")).ReportCreateRoute,
);
const ReportDetailRoute = lazyRoute(
  async () => (await import("@/features/reports/ReportDetailRoute")).ReportDetailRoute,
);

function AuthRouteFallback() {
  return (
    <DelayedFallback>
      <div className="auth-route-fallback" />
    </DelayedFallback>
  );
}

function SuspenseAuthRoute({children}: {children: ReactNode}) {
  return <Suspense fallback={<AuthRouteFallback />}>{children}</Suspense>;
}

export function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <PreferencesProvider>
              <AppRoutes />
            </PreferencesProvider>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </ApolloProvider>
  );
}

function AppRoutes() {
  const location = useLocation();
  const {t} = useI18n();

  const routeError = (
    <FullPageState
      code={t("common.errorCode")}
      description={t("common.unexpectedErrorDescription")}
      title={t("common.unexpectedError")}
      variant="error"
      action={
        <Button onClick={() => window.location.reload()} variant="primary">
          {t("common.retry")}
        </Button>
      }
      secondaryAction={
        <ButtonLink to="/map" variant="secondary">
          {t("common.goToMap")}
        </ButtonLink>
      }
    />
  );

  return (
    <ErrorBoundary fallback={routeError} resetKey={location.key}>
      <Routes>
        <Route
          element={
            <SuspenseAuthRoute>
              <LoginPage />
            </SuspenseAuthRoute>
          }
          path="/login"
        />
        <Route
          element={
            <SuspenseAuthRoute>
              <ForgotPasswordPage />
            </SuspenseAuthRoute>
          }
          path="/login/forgot"
        />
        <Route element={<RequireAuth />}>
          <Route element={<AppShell />}>
            <Route element={<FleetMapRoute />} path="/map" />
            <Route
              element={<Navigate replace to={{pathname: "/map", search: location.search}} />}
              path="/"
            />
            <Route element={<FleetRoute />} path="/fleet" />
            <Route element={<ConstellationOverviewRoute />} path="/constellations" />
            <Route element={<ProfileRoute />} path="/profile" />
            <Route element={<SatelliteListRoute />} path="/satellites" />
            <Route element={<SatelliteDetailRoute />} path="/satellites/:id" />
            <Route element={<PayloadListRoute />} path="/payloads" />
            <Route element={<PayloadDetailRoute />} path="/payloads/:id" />
            <Route element={<CustomerListRoute />} path="/customers" />
            <Route element={<CustomerDetailRoute />} path="/customers/:id" />
            <Route element={<ContactListRoute />} path="/contacts" />
            <Route element={<ContactCreateRoute />} path="/contacts/new" />
            <Route element={<ContactDetailRoute />} path="/contacts/:id" />
            <Route element={<StationListRoute />} path="/stations" />
            <Route element={<StationDetailRoute />} path="/stations/:id" />
            <Route element={<ReportListRoute />} path="/reports" />
            <Route element={<ReportCreateRoute />} path="/reports/new" />
            <Route element={<ReportDetailRoute />} path="/reports/:id" />
            <Route element={<NotFoundPage />} path="*" />
          </Route>
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}
