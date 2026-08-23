import {chromium} from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "docs/screenshots");
const base = "http://127.0.0.1:8080";
const api = "http://127.0.0.1:3000/graphql";

fs.mkdirSync(out, {recursive: true});
for (const file of fs.readdirSync(out)) {
  fs.unlinkSync(path.join(out, file));
}

async function gql(query) {
  const response = await fetch(api, {
    method: "POST",
    headers: {"content-type": "application/json"},
    body: JSON.stringify({query}),
  });
  const json = await response.json();
  if (json.errors?.length) {
    throw new Error(JSON.stringify(json.errors));
  }
  return json.data;
}

const data = await gql(`{
  allSatellites { id }
  allPayloads { id }
  allCustomers { id }
  allContacts { id }
  allGroundStations { id }
  allReports { id }
}`);

const ids = {
  satellite: data.allSatellites[0].id,
  payload: data.allPayloads[0].id,
  customer: data.allCustomers[0].id,
  contact: data.allContacts[0].id,
  station: data.allGroundStations[0].id,
  report: data.allReports[0].id,
};

const shots = [
  {file: "login", path: "/login", auth: false},
  {file: "forgot-password", path: "/login/forgot", auth: false},
  {file: "map", path: "/map", waitMs: 2500},
  {file: "fleet", path: "/fleet", ready: "Fleet awareness"},
  {file: "constellations", path: "/constellations"},
  {file: "payloads", path: "/payloads"},
  {file: "payload-detail", path: `/payloads/${ids.payload}`},
  {file: "satellites", path: "/satellites"},
  {file: "satellite-detail", path: `/satellites/${ids.satellite}`},
  {file: "stations", path: "/stations"},
  {file: "station-detail", path: `/stations/${ids.station}`},
  {file: "contacts", path: "/contacts"},
  {file: "contact-schedule", path: "/contacts/new"},
  {file: "contact-detail", path: `/contacts/${ids.contact}`},
  {file: "reports", path: "/reports"},
  {file: "report-create", path: "/reports/new"},
  {file: "report-detail", path: `/reports/${ids.report}`},
  {file: "customers", path: "/customers"},
  {file: "customer-detail", path: `/customers/${ids.customer}`},
  {file: "profile", path: "/profile"},
];

const browser = await chromium.launch();
const page = await browser.newPage({viewport: {width: 1440, height: 900}});

async function shot(name) {
  const target = path.join(out, `${name}.jpg`);
  await page.screenshot({path: target, type: "jpeg", quality: 70, fullPage: false});
  console.log(name, fs.statSync(target).size);
}

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

for (const item of shots.filter((entry) => entry.auth === false)) {
  await page.goto(`${base}${item.path}`, {waitUntil: "networkidle"});
  await page.waitForTimeout(item.waitMs ?? 500);
  await shot(item.file);
}

await page.goto(`${base}/login`, {waitUntil: "networkidle"});
await page.getByPlaceholder("Commander").fill("Commander");
await page.getByPlaceholder("••••••••").fill("commander");
await page.getByRole("button", {name: "Continue"}).click();
await page.waitForTimeout(1000);

for (const item of shots.filter((entry) => entry.auth !== false)) {
  await page.goto(`${base}${item.path}`, {waitUntil: "networkidle"});
  if (item.ready) {
    await page.getByRole("heading", {name: item.ready}).waitFor({timeout: 20000});
  }
  await page.waitForTimeout(item.waitMs ?? 900);
  await shot(item.file);
}

await browser.close();
console.log("done", out);
