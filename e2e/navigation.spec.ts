import { expect, test } from "@playwright/test";
import { expectSectionAtTop, gotoHome, scrollToSection } from "./helpers";

test.describe("desktop navigation", () => {
    test.skip(({ isMobile }) => isMobile, "The inline nav is hidden on mobile");

    test.beforeEach(async ({ page }) => {
        await gotoHome(page);
    });

    for (const [label, id] of [
        ["Experiencias", "experiencias"],
        ["Beneficios", "beneficios"],
        ["Contacto", "contacto"],
    ]) {
        test(`scrolls to ${label}, focuses it and marks it active`, async ({ page }) => {
            const nav = page.getByRole("navigation", { name: "Principal", exact: true });
            await nav.getByRole("link", { name: label }).click();

            await expectSectionAtTop(page, id);
            await expect(page.locator(`#${id}`)).toBeFocused();
            await expect(nav.getByRole("link", { name: label })).toHaveAttribute("aria-current", "true");
            await expect(page).toHaveURL("/");
        });
    }

    test("the logo returns to the top", async ({ page }) => {
        const nav = page.getByRole("navigation", { name: "Principal", exact: true });
        await nav.getByRole("link", { name: "Contacto" }).click();
        await expectSectionAtTop(page, "contacto");

        await page.getByRole("banner").getByRole("link", { name: "Rock Experience, ir al inicio" }).click();
        await expectSectionAtTop(page, "inicio");
    });

    test("marks the active section while scrolling manually", async ({ page }) => {
        const nav = page.getByRole("navigation", { name: "Principal", exact: true });
        await scrollToSection(page, "beneficios");

        await expect(nav.getByRole("link", { name: "Beneficios" })).toHaveAttribute("aria-current", "true");
        await expect(nav.locator("[aria-current]")).toHaveCount(1);
    });

    test("keeps tracking the active section after coming back from an experience page", async ({ page }) => {
        await page.goto("/experiencias/1");
        await page.getByRole("link", { name: "Volver a experiencias" }).click();

        await expect(page).toHaveURL("/");
        await expectSectionAtTop(page, "experiencias");

        await scrollToSection(page, "beneficios");
        const nav = page.getByRole("navigation", { name: "Principal", exact: true });
        await expect(nav.getByRole("link", { name: "Beneficios" })).toHaveAttribute("aria-current", "true");
    });
});

test.describe("hero and footer links", () => {
    test("the hero actions scroll to experiences and contact", async ({ page }) => {
        await gotoHome(page);
        const hero = page.locator("#inicio");

        await hero.getByRole("link", { name: "Explorar experiencias" }).click();
        await expectSectionAtTop(page, "experiencias");

        await scrollToSection(page, "inicio");
        await hero.getByRole("link", { name: "Quiero participar" }).click();
        await expectSectionAtTop(page, "contacto");
    });

    test("the footer links scroll to their sections", async ({ page }) => {
        await gotoHome(page);
        const footerNav = page.getByRole("navigation", { name: "Pie de página" });

        await expect(footerNav.getByRole("link", { name: "Contacto" })).toHaveAttribute("href", "/#contacto");
        await footerNav.getByRole("link", { name: "Beneficios" }).click();
        await expectSectionAtTop(page, "beneficios");
    });
});

test.describe("mobile menu", () => {
    test.skip(({ isMobile }) => !isMobile, "The menu only exists below 1024px");

    test.beforeEach(async ({ page }) => {
        await gotoHome(page);
    });

    test("opens, locks the page scroll, navigates and closes", async ({ page }) => {
        const menu = page.getByRole("navigation", { name: "Menú principal" });
        await expect(menu).toBeHidden();

        await page.getByRole("button", { name: "Abrir menú" }).click();
        await expect(menu).toBeVisible();
        await expect(page.locator("body")).toHaveCSS("overflow", "hidden");

        await menu.getByRole("link", { name: "Beneficios" }).click();
        await expect(menu).toBeHidden();
        await expectSectionAtTop(page, "beneficios");
    });

    test("closes with the close button and with Escape", async ({ page }) => {
        const menu = page.getByRole("navigation", { name: "Menú principal" });

        await page.getByRole("button", { name: "Abrir menú" }).click();
        await page.getByRole("button", { name: "Cerrar menú" }).click();
        await expect(menu).toBeHidden();

        await page.getByRole("button", { name: "Abrir menú" }).click();
        await page.keyboard.press("Escape");
        await expect(menu).toBeHidden();
    });

    test("closes when the viewport grows to desktop", async ({ page }) => {
        const popover = page.locator("#mobile-menu");
        await page.getByRole("button", { name: "Abrir menú" }).click();
        await expect.poll(() => popover.evaluate((el) => el.matches(":popover-open"))).toBe(true);

        await page.setViewportSize({ width: 1280, height: 800 });
        await expect.poll(() => popover.evaluate((el) => el.matches(":popover-open"))).toBe(false);
    });
});
