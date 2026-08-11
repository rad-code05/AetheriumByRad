import { test, expect } from "@playwright/test";

test("homepage loads and shows the Aetherium heading", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { level: 1, name: "Aetherium" })
  ).toBeVisible();
});
