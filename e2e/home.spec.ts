import { expect, test } from "@playwright/test";

test.describe("home page", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
    });

    test("renders every section with the right landmarks", async ({ page }) => {
        await expect(page).toHaveTitle("Rock Experience | Vive algo diferente.");
        await expect(page.getByRole("heading", { level: 1 })).toHaveText(["Vive algo diferente."]);
        await expect(page.getByRole("main")).toHaveCount(1);
        await expect(page.getByRole("banner")).toBeVisible();
        await expect(page.getByRole("contentinfo")).toBeVisible();

        for (const [id, title] of [
            ["inicio", "Vive algo diferente."],
            ["experiencias", "Experiencias"],
            ["beneficios", "Beneficios"],
            ["contacto", "Quiero participar"],
        ]) {
            await expect(page.getByRole("region", { name: title, exact: true })).toHaveAttribute("id", id);
        }
    });

    test("lists the experiences as links to their detail", async ({ page }) => {
        const section = page.locator("#experiencias");
        await expect(section.getByRole("listitem")).toHaveCount(6);
        await expect(section.getByRole("link", { name: "Gaming Experience" })).toHaveAttribute(
            "href",
            "/experiencias/1",
        );
        await expect(section.getByRole("img", { name: "Gaming Experience" })).toBeVisible();
    });

    test("lists the four benefits", async ({ page }) => {
        await expect(page.locator("#beneficios").getByRole("heading", { level: 3 })).toHaveText([
            "Nuevas audiencias",
            "Tecnología que sorprende",
            "Resultados medibles",
            "Presencial y digital",
        ]);
    });

    test("shows the contact details with working links", async ({ page }) => {
        const section = page.locator("#contacto");
        await expect(section.getByRole("link", { name: "hola@rockexperience.mx" })).toHaveAttribute(
            "href",
            "mailto:hola@rockexperience.mx",
        );
        await expect(section.getByRole("link", { name: "+52 55 0000 0000" })).toHaveAttribute(
            "href",
            "tel:+525500000000",
        );
    });

    test("shows the footer credit", async ({ page }) => {
        await expect(page.getByRole("contentinfo")).toContainText("Landing creada por Gerardo Garcia Medina");
    });
});

test.describe("layout", () => {
    test.skip(({ isMobile }) => isMobile, "Viewports are set explicitly");

    for (const width of [375, 768, 1440]) {
        test(`has no horizontal scroll at ${width}px`, async ({ page }) => {
            await page.setViewportSize({ width, height: 900 });
            await page.goto("/");
            const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
            expect(overflow).toBeLessThanOrEqual(0);
        });
    }
});

test.describe("SEO files", () => {
    test.skip(({ isMobile }) => isMobile, "Not viewport dependent");

    test("serves robots.txt and a sitemap with every page", async ({ request }) => {
        expect(await (await request.get("/robots.txt")).text()).toContain("Disallow: /api/");

        const sitemap = await (await request.get("/sitemap.xml")).text();
        expect(sitemap).toContain("/aviso-de-privacidad</loc>");
        for (let id = 1; id <= 6; id++) expect(sitemap).toContain(`/experiencias/${id}</loc>`);
    });

    test("returns a 404 for unknown routes", async ({ request }) => {
        expect((await request.get("/no-existe")).status()).toBe(404);
    });
});

test("the privacy notice links back home", async ({ page }) => {
    await page.goto("/aviso-de-privacidad");
    await expect(page).toHaveTitle("Aviso de privacidad | Rock Experience");
    await expect(page.getByRole("heading", { level: 1, name: "Aviso de privacidad" })).toBeVisible();

    await page.getByRole("link", { name: "Volver al inicio" }).click();
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("heading", { level: 1, name: "Vive algo diferente." })).toBeVisible();
});
