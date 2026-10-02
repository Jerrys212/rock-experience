import { expect, test } from "@playwright/test";

test.describe("loading and error states (dev server only)", () => {
    test("shows a skeleton while the experiences load", async ({ page }) => {
        await page.goto("/?simular=carga", { waitUntil: "commit" });

        await expect(page.getByRole("status").filter({ hasText: "Cargando experiencias…" })).toBeAttached();
        await expect(page.getByRole("link", { name: "Gaming Experience" })).toBeVisible({ timeout: 30_000 });
        await expect(page.getByText("Cargando experiencias…")).toHaveCount(0);
    });

    test("shows an error with a retry button when the list fails", async ({ page }) => {
        await page.goto("/?simular=error");

        const alert = page.locator("#experiencias").getByRole("alert");
        await expect(alert).toContainText("No pudimos cargar las experiencias");
        await expect(alert.getByRole("button", { name: "Reintentar" })).toBeEnabled();
    });

    test("shows an error with a retry button when a detail fails", async ({ page }) => {
        await page.goto("/experiencias/1?simular=error");

        const alert = page.getByRole("main").getByRole("alert");
        await expect(alert.getByRole("heading", { level: 1 })).toHaveText("No pudimos cargar esta experiencia");
        await expect(alert.getByRole("button", { name: "Reintentar" })).toBeEnabled();
    });
});
