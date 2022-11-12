const fs = require("fs");
const puppeteer = require("puppeteer");
const lighthouse = require("lighthouse/lighthouse-core/fraggle-rock/api.js");

async function captureReport() {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      "--allow-no-sandbox-job",
      "--allow-sandbox-debugging",
      "--no-sandbox",
      "--disable-storage-reset=true",
      "--start-maximized"
    ],
  });
  const page = await browser.newPage();

  await page.setViewport({ width: 1920, height: 1080 });
  await page.setDefaultTimeout(10000);

  const flow = await lighthouse.startFlow(page, {
    name: "tables flows",
    configContext: {
      settingsOverrides: {
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 0,
          uploadThroughputKbps: 0,
          uploadThroughputKbps: 0,
        },
        throttlingMethod: "simulate",
        screenEmulation: {
          mobile: false,
          width: 1920,
          height: 1080,
          deviceScaleFactor: 1,
          disabled: false,
        },
        formFactor: "desktop",
        onlyCategories: ["performance"],
      },
    },
  });

  // Cold Navigation
  await flow.navigate("http://localhost/", {
    stepName: "open main page",
  });
  console.log("main page is opened");

  await flow.navigate("http://localhost/category/tables", {
    stepName: "open tables and add product to cart",
  });
  console.log("tables category opened");

  await page.click('.product-img');
  console.log("table page opened");

  await page.waitForSelector('.pro-details-cart.btn-hover');
  await page.hover('.pro-details-cart.btn-hover');
  await page.click('.pro-details-cart.btn-hover > button');
  console.log("table added to cart");

  await page.waitForSelector('.react-toast-notifications__container');

  await flow.navigate("http://localhost/cart", {
    stepName: "open cart and check out",
  });
  console.log("cart opened");

  await page.click('.cart-main-area a[href="/checkout"]');

  const reportPath = "./user-flow.report.html";
  const report = await flow.generateReport();
  fs.writeFileSync(reportPath, report);
  console.log("report is created");

  await browser.close();
}
captureReport();
