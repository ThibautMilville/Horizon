import type {MockedResponse} from "@apollo/client/testing";
import {screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {useState} from "react";
import {Route, Routes, useLocation} from "react-router-dom";
import {describe, expect, it} from "vitest";

import {DEMO_PASSWORD, DEMO_USERNAME} from "@/features/auth/auth-credentials";
import {LoginPage} from "@/features/auth/LoginPage";
import {RequireAuth} from "@/features/auth/RequireAuth";
import {ContactListRoute} from "@/features/contacts/ContactListRoute";
import {useCreateContact} from "@/features/contacts/useContactForm";
import {useCreateComment, useCreateReport} from "@/features/reports/useReportForm";
import type {CommentFormValues, ReportFormValues} from "@/features/reports/report-form";
import {
  ContactListDocument,
  CreateCommentDocument,
  CreateContactDocument,
  CreateReportDocument,
  ReportDetailDocument,
  ReportListDocument,
} from "@/shared/graphql";
import {emptyContactFormValues, type ContactFormValues} from "@/shared/lib/contact-form-values";
import {renderApp} from "@/test/render";

function LocationProbe() {
  const location = useLocation();
  return <div data-testid="location">{`${location.pathname}${location.search}`}</div>;
}

describe("authentication flows", () => {
  it("RequireAuth redirects anonymous users to login", async () => {
    renderApp(
      <Routes>
        <Route element={<RequireAuth />}>
          <Route element={<div>protected</div>} path="/contacts" />
        </Route>
        <Route element={<div>login-screen</div>} path="/login" />
      </Routes>,
      {
        route: "/contacts",
      },
    );

    expect(await screen.findByText("login-screen")).toBeInTheDocument();
    expect(screen.queryByText("protected")).not.toBeInTheDocument();
  });

  it("login redirects to the original protected route", async () => {
    const user = userEvent.setup();

    renderApp(
      <Routes>
        <Route element={<LoginPage />} path="/login" />
        <Route element={<div>fleet-home</div>} path="/fleet" />
      </Routes>,
      {
        route: {pathname: "/login", state: {from: "/fleet"}},
      },
    );

    await user.type(screen.getByPlaceholderText("Commander"), DEMO_USERNAME);
    await user.type(screen.getByPlaceholderText("••••••••"), DEMO_PASSWORD);
    await user.click(screen.getByRole("button", {name: "Continue"}));

    expect(await screen.findByText("fleet-home")).toBeInTheDocument();
  });
});

describe("contact flows", () => {
  it("contact list renders query results", async () => {
    const mocks: MockedResponse[] = [
      {
        request: {query: ContactListDocument},
        result: {
          data: {
            allContacts: [
              {
                id: "contact-1",
                date: "2020-01-15T10:00:00.000Z",
                type: "Maintenance",
                satellite_id: "sat-1",
                groundStation_id: "gs-1",
                Satellite: {id: "sat-1", name: "Horizon-1"},
                GroundStation: {id: "gs-1", name: "Kourou"},
              },
            ],
          },
        },
      },
    ];

    renderApp(
      <Routes>
        <Route element={<ContactListRoute />} path="/contacts" />
      </Routes>,
      {
        route: "/contacts",
        mocks,
      },
    );

    expect(await screen.findByText("Horizon-1")).toBeInTheDocument();
    expect(screen.getByText("Kourou")).toBeInTheDocument();
  });

  it("contact list surfaces query errors", async () => {
    const mocks: MockedResponse[] = [
      {
        request: {query: ContactListDocument},
        error: new Error("contacts unavailable"),
      },
    ];

    renderApp(
      <Routes>
        <Route element={<ContactListRoute />} path="/contacts" />
      </Routes>,
      {
        route: "/contacts",
        mocks,
      },
    );

    expect(await screen.findByText("Could not load contacts")).toBeInTheDocument();
    expect(screen.getByText("contacts unavailable")).toBeInTheDocument();
  });

  it("create contact mutation navigates to the new detail route", async () => {
    const user = userEvent.setup();
    const values: ContactFormValues = {
      ...emptyContactFormValues,
      date: "2026-08-21T12:00",
      type: "Customer Task",
      executionScript: "pass",
      configurationText: "{\n}\n",
      groundStation_id: "gs-1",
      satellite_id: "sat-1",
      employee_id: "emp-1",
    };

    const mocks: MockedResponse[] = [
      {
        request: {
          query: CreateContactDocument,
          variables: {
            date: "2026-08-21T12:00:00.000Z",
            type: "Customer Task",
            executionScript: "pass",
            configuration: {},
            groundStation_id: "gs-1",
            satellite_id: "sat-1",
            payload_id: null,
            employee_id: "emp-1",
          },
        },
        result: {
          data: {
            createContact: {id: "contact-42"},
          },
        },
      },
      {
        request: {query: ContactListDocument},
        result: {data: {allContacts: []}},
      },
    ];

    function CreateHarness() {
      const create = useCreateContact();
      return (
        <button
          onClick={() => {
            void create.submit(values);
          }}
          type="button"
        >
          Create contact
        </button>
      );
    }

    renderApp(
      <Routes>
        <Route element={<CreateHarness />} path="/contacts/new" />
        <Route
          element={
            <>
              <div>created</div>
              <LocationProbe />
            </>
          }
          path="/contacts/:id"
        />
      </Routes>,
      {
        route: "/contacts/new",
        mocks,
      },
    );

    await user.click(screen.getByRole("button", {name: "Create contact"}));

    expect(await screen.findByText("created")).toBeInTheDocument();
    expect(screen.getByTestId("location")).toHaveTextContent("/contacts/contact-42");
  });
});

describe("report flows", () => {
  it("surfaces a report mutation error and succeeds on retry", async () => {
    const user = userEvent.setup();
    const values: ReportFormValues = {
      type: "Issue",
      date: "2026-08-21T12:00",
      title: "Telemetry gap",
      content: "Investigate the missing samples.",
      employee_id: "employee-1",
      satellite_id: "satellite-1",
      groundStation_id: "",
    };
    const request = {
      query: CreateReportDocument,
      variables: {
        type: "Issue",
        date: "2026-08-21T12:00:00.000Z",
        title: "Telemetry gap",
        content: "Investigate the missing samples.",
        employee_id: "employee-1",
        satellite_id: "satellite-1",
        groundStation_id: null,
      },
    };
    const mocks: MockedResponse[] = [
      {request, error: new Error("report unavailable")},
      {request, result: {data: {createReport: {id: "report-42"}}}},
      {request: {query: ReportListDocument}, result: {data: {allReports: []}}},
    ];

    function CreateReportHarness() {
      const create = useCreateReport();
      const [error, setError] = useState("");
      return (
        <>
          <button
            onClick={() => {
              void create.submit(values).catch((reason: unknown) => {
                setError(reason instanceof Error ? reason.message : "unknown error");
              });
            }}
            type="button"
          >
            Create report
          </button>
          <output>{error}</output>
        </>
      );
    }

    renderApp(
      <Routes>
        <Route element={<CreateReportHarness />} path="/reports/new" />
        <Route element={<LocationProbe />} path="/reports/:id" />
      </Routes>,
      {route: "/reports/new", mocks},
    );

    await user.click(screen.getByRole("button", {name: "Create report"}));
    expect(await screen.findByText("report unavailable")).toBeInTheDocument();
    await user.click(screen.getByRole("button", {name: "Create report"}));

    expect(await screen.findByTestId("location")).toHaveTextContent("/reports/report-42");
  });

  it("allows retrying a failed comment mutation", async () => {
    const user = userEvent.setup();
    const values: CommentFormValues = {
      date: "2026-08-21T12:00",
      content: "Telemetry recovered.",
      employee_id: "employee-1",
    };
    const request = {
      query: CreateCommentDocument,
      variables: {
        date: "2026-08-21T12:00:00.000Z",
        content: "Telemetry recovered.",
        report_id: "report-1",
        employee_id: "employee-1",
      },
    };
    const mocks: MockedResponse[] = [
      {request, error: new Error("comment unavailable")},
      {request, result: {data: {createComment: {id: "comment-42"}}}},
      {
        request: {query: ReportDetailDocument, variables: {id: "report-1"}},
        result: {data: {Report: null, allComments: []}},
      },
    ];

    function CreateCommentHarness() {
      const create = useCreateComment("report-1");
      const [status, setStatus] = useState("");
      return (
        <>
          <button
            onClick={() => {
              void create
                .submit(values)
                .then(() => setStatus("comment created"))
                .catch((reason: unknown) => {
                  setStatus(reason instanceof Error ? reason.message : "unknown error");
                });
            }}
            type="button"
          >
            Create comment
          </button>
          <output>{status}</output>
        </>
      );
    }

    renderApp(<CreateCommentHarness />, {mocks});

    await user.click(screen.getByRole("button", {name: "Create comment"}));
    expect(await screen.findByText("comment unavailable")).toBeInTheDocument();
    await user.click(screen.getByRole("button", {name: "Create comment"}));

    expect(await screen.findByText("comment created")).toBeInTheDocument();
  });
});
