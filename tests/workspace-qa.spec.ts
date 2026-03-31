import { expect, test } from "@playwright/test";

test.describe("workspace qa dashboard", () => {
  test("renders all five surfaces with the debug overlay", async ({ page }) => {
    await page.goto("/workspace/qa");
    await expect(page.getByRole("heading", { name: "Surface QA Dashboard" })).toBeVisible();
    await expect(page.getByText("flat-map")).toBeVisible();
    await expect(page.getByText("theater-3d")).toBeVisible();
    await expect(page.getByText("Geometry Integrity").first()).toBeVisible();
    await expect(page.getByText("BBox Source: OPERATIONAL").first()).toBeVisible();
    await expect(page.getByText("32km").first()).toBeVisible();
    await expect(page).toHaveScreenshot("workspace-qa-dashboard.png", { fullPage: true });
  });
});
