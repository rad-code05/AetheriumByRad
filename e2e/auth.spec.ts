import { clerk, setupClerkTestingToken } from "@clerk/testing/playwright";
import { test, expect } from "@playwright/test";

test("a logged-out user is redirected to sign-in", async ({ page }) => {
  await page.goto("/dashboard");
  await page.waitForURL(/\/sign-in/);
});

test("a signed-in user reaches the dashboard", async ({ page }) => {
  await setupClerkTestingToken({ page });
  await page.goto("/");
  await clerk.signIn({
    page,
    emailAddress: process.env.E2E_CLERK_USER_EMAIL!,
  });

  await page.goto("/dashboard");
  await expect(page.getByText("Dashboard — empty for now.")).toBeVisible();
});

test("a signed-in non-admin is blocked from /admin", async ({ page }) => {
  await setupClerkTestingToken({ page });
  await page.goto("/");
  await clerk.signIn({
    page,
    emailAddress: process.env.E2E_CLERK_USER_EMAIL!,
  });

  await page.goto("/admin");
  await page.waitForURL("http://localhost:3000/");
});
