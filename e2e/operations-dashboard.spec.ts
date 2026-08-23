import { expect, test } from "@playwright/test";

test("searches fleet assets, opens fleet analytics, and applies the light theme", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "horizon.prefs",
      JSON.stringify({
        language: "en",
        theme: "light",
        textScale: "md",
        motion: "off",
      }),
    );
  });

  await page.goto("/login");
  await page.getByPlaceholder("Commander").fill("Commander");
  await page.getByPlaceholder("••••••••").fill("commander");
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByRole("link", { name: "Map" }).click();
  await page.getByRole("button", { name: "Search all fleet assets" }).click();
  await page
    .getByRole("combobox", { name: "Search all fleet assets" })
    .fill("KSAT Svalbard");
  await page.getByRole("option", { name: /^KSAT Svalbard\b/ }).click();
  await expect(page).toHaveURL(/\/map\?station=/);

  await page.getByRole("button", { name: "Search all fleet assets" }).click();
  await page
    .getByRole("combobox", { name: "Search all fleet assets" })
    .fill("Starlink-1");
  await page.getByRole("option", { name: /^Starlink-1\b/ }).click();
  await expect(page).toHaveURL(/\/map\?satellite=/);

  await page.getByRole("link", { name: "Fleet" }).click();

  await expect(page).toHaveURL(/\/fleet$/);
  await expect(
    page.getByRole("heading", { name: "Fleet awareness" }),
  ).toBeVisible();
  await expect(
    page.getByRole("img", {
      name: "Satellite count by operational status",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("img", {
      name: "Ground-station status counts stacked by network provider",
    }),
  ).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});
