import {act, fireEvent, screen} from "@testing-library/react";
import {useState} from "react";
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";

import {renderApp} from "@/test/render";

import {useContactEditor} from "./useContactEditor";

const mocks = vi.hoisted(() => {
  const save = vi.fn();
  const saveById = new Map<string, (values: unknown) => Promise<void>>();
  return {save, saveById};
});

vi.mock("./useContactDetail", () => ({
  useContactDetail: (id: string) => ({
    loading: false,
    errorMessage: undefined,
    contact: {
      id,
      date: "2026-08-21T12:00:00.000Z",
      type: id === "contact-a" ? "Maintenance" : "Customer Task",
      executionScript: "pass",
      configuration: {},
      groundStation_id: "station-1",
      satellite_id: "satellite-1",
      payload_id: null,
      employee_id: "employee-1",
    },
    retry: vi.fn(),
  }),
}));

vi.mock("./useContactForm", () => ({
  useContactFormOptions: () => ({
    loading: false,
    errorMessage: undefined,
    satellites: [],
    stations: [],
    employees: [],
    payloads: [],
    retry: vi.fn(),
  }),
}));

vi.mock("./useContactMutations", () => ({
  useUpdateContact: (id: string) => {
    if (!mocks.saveById.has(id)) {
      mocks.saveById.set(id, async (values) => {
        await mocks.save(id, values);
      });
    }
    return {saving: false, save: mocks.saveById.get(id)};
  },
}));

function ContactEditorHarness() {
  const [id, setId] = useState("contact-a");
  const editor = useContactEditor(id);

  return (
    <>
      <output data-testid="contact-id">{id}</output>
      <output data-testid="contact-type">{editor.values.type}</output>
      <button
        onClick={() => editor.setValues((current) => ({...current, type: "Employee Task"}))}
        type="button"
      >
        Edit
      </button>
      <button
        onClick={() => editor.setValues((current) => ({...current, type: "Customer Task"}))}
        type="button"
      >
        Edit again
      </button>
      <button onClick={() => setId("contact-b")} type="button">
        Next contact
      </button>
    </>
  );
}

describe("useContactEditor", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mocks.save.mockReset();
    mocks.saveById.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("debounces autosave and does not duplicate a queued save when the route id changes", async () => {
    let resolveFirstSave: () => void = () => undefined;
    mocks.save
      .mockImplementationOnce(
        () =>
          new Promise<void>((resolve) => {
            resolveFirstSave = () => resolve();
          }),
      )
      .mockResolvedValue(undefined);
    renderApp(<ContactEditorHarness />);

    await act(async () => undefined);
    expect(screen.getByText("Maintenance")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", {name: "Edit"}));

    act(() => vi.advanceTimersByTime(749));
    expect(mocks.save).not.toHaveBeenCalled();
    await act(async () => vi.advanceTimersByTime(1));
    expect(mocks.save).toHaveBeenCalledTimes(1);
    expect(mocks.save).toHaveBeenLastCalledWith(
      "contact-a",
      expect.objectContaining({type: "Employee Task"}),
    );

    fireEvent.click(screen.getByRole("button", {name: "Edit again"}));
    await act(async () => vi.advanceTimersByTime(750));
    expect(mocks.save).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", {name: "Next contact"}));
    await act(async () => undefined);
    expect(screen.getByText("Customer Task")).toBeInTheDocument();
    await act(async () => {
      resolveFirstSave();
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(screen.getByTestId("contact-id")).toHaveTextContent("contact-b");
    expect(mocks.save).toHaveBeenCalledTimes(2);
    expect(mocks.save).toHaveBeenLastCalledWith(
      "contact-a",
      expect.objectContaining({type: "Customer Task"}),
    );
  });
});
