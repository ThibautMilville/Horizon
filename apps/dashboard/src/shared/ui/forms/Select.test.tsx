import {screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {describe, expect, it, vi} from "vitest";

import {renderApp} from "@/test/render";

import {Select} from "./Select";

describe("Select", () => {
  const options = [
    {value: "a", label: "Alpha", disabled: true},
    {value: "b", label: "Bravo"},
    {value: "c", label: "Charlie"},
  ];

  it("exposes required semantics on its trigger", () => {
    renderApp(
      <Select
        aria-label="Operator"
        onChange={() => undefined}
        options={options}
        required
        value=""
      />,
    );

    expect(screen.getByRole("button", {name: "Operator"})).toHaveAttribute("aria-required", "true");
  });

  it("filters and selects an option from the search input with the keyboard", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    renderApp(
      <Select aria-label="Operator" onChange={onChange} options={options} searchable value="" />,
    );

    await user.click(screen.getByRole("button", {name: "Operator"}));
    const search = screen.getByRole("combobox");
    await user.type(search, "char");
    await user.keyboard("{Enter}");

    expect(onChange).toHaveBeenCalledWith("c");
  });

  it("closes its floating menu on Escape", async () => {
    const user = userEvent.setup();
    renderApp(
      <Select aria-label="Operator" onChange={() => undefined} options={options} value="b" />,
    );

    await user.click(screen.getByRole("button", {name: "Operator"}));
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});
