import { expect, type Page } from "@playwright/test";

const NAVBAR_MAX_HEIGHT = 80;

const sectionTop = (page: Page, id: string) =>
    page.locator(`#${id}`).evaluate((section) => Math.round(section.getBoundingClientRect().top));

export async function expectSectionAtTop(page: Page, id: string) {
    await expect.poll(() => sectionTop(page, id)).toBeGreaterThanOrEqual(0);
    await expect.poll(() => sectionTop(page, id)).toBeLessThanOrEqual(NAVBAR_MAX_HEIGHT);
}

export async function scrollToSection(page: Page, id: string) {
    await page.locator(`#${id}`).evaluate((section) => section.scrollIntoView());
}

export async function gotoHome(page: Page) {
    await page.goto("/");
    await expect(page.locator("#experiencias").getByRole("link", { name: "Gaming Experience" })).toBeVisible();
}
