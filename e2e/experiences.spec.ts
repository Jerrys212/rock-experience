import { expect, test } from "@playwright/test";
import { expectSectionAtTop, gotoHome } from "./helpers";

test.describe("experience modal", () => {
    test.beforeEach(async ({ page }) => {
        await gotoHome(page);
        await page.getByRole("link", { name: "Gaming Experience" }).click();
    });

    test("opens the detail over the landing", async ({ page }) => {
        const dialog = page.getByRole("dialog", { name: "Gaming Experience" });

        await expect(dialog).toBeVisible();
        await expect(page).toHaveURL("/experiencias/1");
        await expect(dialog.getByRole("heading", { level: 2, name: "Gaming Experience" })).toBeVisible();
        await expect(dialog.getByRole("heading", { name: "Lo que vivirás" })).toBeVisible();
        await expect(dialog.getByRole("listitem")).toHaveCount(4);
        await expect(dialog.getByText("Hasta 500 personas")).toBeVisible();
        await expect(page.locator("#experiencias")).toBeAttached();
        await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
    });

    test("closes with the close button and restores focus", async ({ page }) => {
        await page.getByRole("button", { name: "Cerrar detalle" }).click();

        await expect(page.getByRole("dialog")).toBeHidden();
        await expect(page).toHaveURL("/");
        await expect(page.getByRole("link", { name: "Gaming Experience" })).toBeFocused();
    });

    test("closes with Escape", async ({ page }) => {
        await expect(page.getByRole("dialog")).toBeVisible();
        await page.keyboard.press("Escape");

        await expect(page.getByRole("dialog")).toBeHidden();
        await expect(page).toHaveURL("/");
    });

    test("closes when clicking the backdrop", async ({ page }) => {
        await expect(page.getByRole("dialog")).toBeVisible();
        await page.mouse.click(2, 2);

        await expect(page.getByRole("dialog")).toBeHidden();
        await expect(page).toHaveURL("/");
    });

    test("the CTA closes the modal and scrolls to the contact form", async ({ page }) => {
        await page.getByRole("dialog").getByRole("link", { name: "Participa ya" }).click();

        await expect(page.getByRole("dialog")).toBeHidden();
        await expect(page).toHaveURL("/");
        await expectSectionAtTop(page, "contacto");
    });

    test("reloading shows the standalone page", async ({ page }) => {
        await expect(page.getByRole("dialog")).toBeVisible();
        await page.reload();

        await expect(page.getByRole("dialog")).toBeHidden();
        await expect(page.getByRole("heading", { level: 1, name: "Gaming Experience" })).toBeVisible();
    });
});

test.describe("experience page", () => {
    test("renders the detail with its own metadata", async ({ page }) => {
        await page.goto("/experiencias/1");

        await expect(page).toHaveTitle("Gaming Experience | Rock Experience");
        await expect(page.getByRole("heading", { level: 1 })).toHaveText(["Gaming Experience"]);
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/experiencias\/1$/);
        await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute("content", "Rock Experience");
        await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute("content", "Gaming Experience");
        await expect(page.getByRole("dialog")).toHaveCount(0);
    });

    test("the CTA takes the user to the contact form", async ({ page }) => {
        await page.goto("/experiencias/2");
        await page.getByRole("link", { name: "Participa ya" }).click();

        await expect(page).toHaveURL("/");
        await expectSectionAtTop(page, "contacto");
    });

    for (const id of ["999", "abc", "1.0"]) {
        test(`shows a not found message for ${id}`, async ({ page }) => {
            await page.goto(`/experiencias/${id}`);

            await expect(
                page.getByRole("heading", { level: 1, name: "No encontramos esta experiencia" }),
            ).toBeVisible();
            await expect(page.getByRole("link", { name: "Volver a experiencias" })).toBeVisible();
        });
    }
});

test.describe("experiences API", () => {
    test.skip(({ isMobile }) => isMobile, "Not viewport dependent");

    test("returns the list and each detail", async ({ request }) => {
        const list = await request.get("/api/experiences");
        expect(list.status()).toBe(200);
        expect(await list.json()).toHaveLength(6);

        const detail = await request.get("/api/experiences/1");
        expect(await detail.json()).toMatchObject({ id: 1, details: { format: "Presencial" } });

        expect((await request.get("/api/experiences/999")).status()).toBe(404);
        expect((await request.get("/api/experiences/abc")).status()).toBe(400);
    });
});
