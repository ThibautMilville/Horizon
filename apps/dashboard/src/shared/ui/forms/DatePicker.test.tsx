import {fireEvent, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {useState} from "react";
import {describe, expect, it} from "vitest";

import {renderApp} from "@/test/render";

import {DatePicker} from "./DatePicker";

function DatePickerHarness() {
  const [value, setValue] = useState("2026-08-21T10:30");
  return (
    <>
      <DatePicker aria-label="Contact date" includeTime onChange={setValue} value={value} />
      <output>{value}</output>
    </>
  );
}

describe("DatePicker", () => {
  it("navigates months and commits a date and UTC time", async () => {
    const user = userEvent.setup();
    renderApp(<DatePickerHarness />);

    await user.click(screen.getByRole("button", {name: "Contact date"}));
    const dialog = await screen.findByRole("dialog", {name: "Select a date"});
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveFocus();

    await user.click(screen.getByRole("button", {name: "Next month"}));
    await user.click(screen.getByRole("button", {name: "15"}));
    fireEvent.change(screen.getByLabelText("Time (UTC)"), {target: {value: "14:45"}});
    await user.click(screen.getByRole("button", {name: "Done"}));

    expect(screen.getByText("2026-09-15T14:45")).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("button", {name: "Contact date"})).toHaveFocus();
  });

  it("restores focus to the trigger when closed with Escape", async () => {
    const user = userEvent.setup();
    renderApp(<DatePickerHarness />);

    const trigger = screen.getByRole("button", {name: "Contact date"});
    await user.click(trigger);
    expect(await screen.findByRole("dialog", {name: "Select a date"})).toHaveFocus();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
