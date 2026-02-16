import { test, expect } from "@playwright/test";

test.describe("MVP present flow", () => {
  test("open app, go to clients, select client, present, advance screens, exit", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page).toHaveURL(/\/(dashboard)?\/?$/);
    await page.getByRole("link", { name: /clients/i }).first().click();

    await expect(page).toHaveURL(/\/clients/);
    await expect(
      page.getByRole("heading", { name: /clients/i })
    ).toBeVisible();

    const firstClientCard = page.getByRole("link", { name: /Acme Holdings/i });
    await firstClientCard.click();

    await expect(page).toHaveURL(/\/clients\/client-1\/present/);

    const footer = page.locator("footer");
    await expect(footer.getByText("1 of 4")).toBeVisible();

    await page.getByRole("button", { name: "Next screen" }).click();
    await expect(footer.getByText("2 of 4")).toBeVisible();

    await page.getByRole("button", { name: "Next screen" }).click();
    await expect(footer.getByText("3 of 4")).toBeVisible();

    await page.getByRole("link", { name: "Exit presentation" }).click();

    await expect(page).toHaveURL(/\/clients/);
  });
});
