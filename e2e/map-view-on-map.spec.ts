import { expect, test } from "@playwright/test";

const STATION_NAME = "AWS Dublin";
const MAX_CENTER_DRIFT = 128;

async function login(page: import("@playwright/test").Page) {
  await page.addInitScript(() => {
    localStorage.setItem(
      "horizon.prefs",
      JSON.stringify({
        language: "en",
        theme: "dark",
        textScale: "md",
        motion: "off",
      }),
    );
  });

  await page.goto("/login");
  await page.getByPlaceholder("Commander").fill("Commander");
  await page.getByPlaceholder("••••••••").fill("commander");
  await page.getByRole("button", { name: "Continue" }).click();
}

async function readSelectionLayout(page: import("@playwright/test").Page) {
  const map = page.locator(".horizon-map");
  const mapBox = await map.boundingBox();
  const markerBox = await page
    .locator(".horizon-map-marker-selected")
    .boundingBox();
  const popoverBox = await page
    .locator("aside[aria-label*='details'], aside[aria-label*='Détails']")
    .boundingBox();
  const statusBarBox = await page
    .locator(
      "footer[aria-label*='Map status'], footer[aria-label*='Statut carte']",
    )
    .boundingBox();

  if (!mapBox || !markerBox || !popoverBox) {
    return null;
  }

  const visibleBottom = statusBarBox?.y ?? mapBox.y + mapBox.height;
  const groupTop = Math.min(markerBox.y, popoverBox.y);
  const groupBottom = Math.max(
    markerBox.y + markerBox.height,
    popoverBox.y + popoverBox.height,
  );
  const groupCenterY = (groupTop + groupBottom) / 2;
  const targetCenterY = mapBox.y + (visibleBottom - mapBox.y) / 2;

  return {
    groupCenterY,
    targetCenterY,
    mapLeft: mapBox.x,
    mapRight: mapBox.x + mapBox.width,
    markerLeft: markerBox.x,
    markerRight: markerBox.x + markerBox.width,
    popoverLeft: popoverBox.x,
    popoverRight: popoverBox.x + popoverBox.width,
    groupBottom,
    visibleBottom,
    statusBarTop: statusBarBox?.y,
  };
}

test("show on map recenters a fixed station above the info bar", async ({
  page,
}) => {
  await login(page);

  await page.goto("/stations");
  const stationRow = page.getByRole("row").filter({ hasText: STATION_NAME });
  await expect(stationRow).toBeVisible();

  const mapHref = await stationRow
    .getByRole("link", { name: "Show on map" })
    .getAttribute("href");
  expect(mapHref).not.toBeNull();
  const mapUrl = new URL(mapHref ?? "/map", page.url());
  mapUrl.searchParams.delete("focus");
  await page.goto(`${mapUrl.pathname}${mapUrl.search}`);
  await expect(page).toHaveURL(/\/map\?station=/);

  await expect(page.locator(".horizon-map")).toBeVisible();
  await expect(page.locator(".horizon-map-marker-selected")).toBeVisible();
  await expect(
    page.locator("aside[aria-label*='details'], aside[aria-label*='Détails']"),
  ).toBeVisible();
  await expect(page.locator("footer[aria-label='Map status']")).toBeVisible();

  await expect
    .poll(
      async () => {
        const layout = await readSelectionLayout(page);
        if (!layout) {
          return Number.POSITIVE_INFINITY;
        }
        return Math.abs(layout.groupCenterY - layout.targetCenterY);
      },
      { timeout: 10_000 },
    )
    .toBeLessThan(MAX_CENTER_DRIFT);

  const layout = await readSelectionLayout(page);
  expect(layout).not.toBeNull();

  if (layout) {
    expect(Math.abs(layout.groupCenterY - layout.targetCenterY)).toBeLessThan(
      MAX_CENTER_DRIFT,
    );
    expect(layout.markerLeft).toBeGreaterThanOrEqual(layout.mapLeft - 4);
    expect(layout.markerRight).toBeLessThanOrEqual(layout.mapRight + 4);
    expect(layout.popoverLeft).toBeGreaterThanOrEqual(layout.mapLeft - 4);
    expect(layout.popoverRight).toBeLessThanOrEqual(layout.mapRight + 4);

    if (layout.statusBarTop !== undefined) {
      expect(layout.groupBottom).toBeLessThanOrEqual(layout.visibleBottom + 4);
    }
  }
});
