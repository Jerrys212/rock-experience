import { expect, test, type Page } from "@playwright/test";
import { gotoHome } from "./helpers";
import { readMailbox, REJECT_MARKER } from "./mailbox";

const uniqueEmail = (testId: string) => `e2e-${testId.slice(0, 12)}-${Date.now()}@example.com`;

const form = (page: Page) => page.locator("#contacto form");

async function fillValidForm(page: Page, email: string, message = "Queremos una activación para nuestro lanzamiento.") {
    const contact = form(page);
    await contact.getByLabel("Nombre").fill("Ana Prueba");
    await contact.getByLabel("Correo electrónico").fill(email);
    await contact.getByLabel("Teléfono").fill("55 1234 5678");
    await contact.getByLabel("Empresa").fill("Rock Co");
    await contact.getByLabel("Mensaje").fill(message);
    await contact.getByRole("checkbox", { name: /aviso de privacidad/ }).check();
}

test.beforeEach(async ({ page }) => {
    await gotoHome(page);
});

test("shows every validation error and focuses the first invalid field", async ({ page }) => {
    await form(page).getByRole("button", { name: "Enviar datos" }).click();

    const contact = form(page);
    await expect(contact.getByText("Escribe tu nombre (mínimo 2 caracteres).")).toBeVisible();
    await expect(contact.getByText("Escribe un correo válido, por ejemplo nombre@empresa.com.")).toBeVisible();
    await expect(contact.getByText("El teléfono debe tener 10 dígitos.")).toBeVisible();
    await expect(contact.getByText("Escribe un mensaje.")).toBeVisible();
    await expect(contact.getByText("Debes aceptar el aviso de privacidad para continuar.")).toBeVisible();

    await expect(contact.getByLabel("Nombre")).toBeFocused();
    await expect(contact.getByLabel("Nombre")).toHaveAttribute("aria-invalid", "true");
    await expect(contact.getByLabel("Nombre")).toHaveAccessibleDescription("Escribe tu nombre (mínimo 2 caracteres).");
    await expect(contact.getByLabel("Empresa")).not.toHaveAttribute("aria-invalid");
});

test("clears an error as soon as the field becomes valid", async ({ page }) => {
    const contact = form(page);
    await contact.getByRole("button", { name: "Enviar datos" }).click();
    await expect(contact.getByText("Escribe un mensaje.")).toBeVisible();

    await contact.getByLabel("Mensaje").fill("Hola");
    await expect(contact.getByText("Escribe un mensaje.")).toBeHidden();
    await expect(contact.getByLabel("Mensaje")).not.toHaveAttribute("aria-invalid");
});

test("rejects an invalid email", async ({ page }) => {
    const contact = form(page);
    await fillValidForm(page, "ana.example.com");
    await contact.getByRole("button", { name: "Enviar datos" }).click();

    await expect(contact.getByText("Escribe un correo válido, por ejemplo nombre@empresa.com.")).toBeVisible();
    await expect(contact.getByLabel("Correo electrónico")).toBeFocused();
});

test("strips digits from the name and caps the phone at 10 digits while typing", async ({ page }) => {
    const contact = form(page);

    await contact.getByLabel("Nombre").pressSequentially("Ana 123");
    await expect(contact.getByLabel("Nombre")).toHaveValue("Ana ");

    await contact.getByLabel("Teléfono").pressSequentially("+52 (55) ab 1234-5678 99");
    await expect(contact.getByLabel("Teléfono")).toHaveValue("52 (55)  1234-56 ");
});

test("the privacy link opens in a new tab", async ({ page }) => {
    const link = form(page).getByRole("link", { name: /aviso de privacidad/ });
    await expect(link).toHaveAttribute("href", "/aviso-de-privacidad");
    await expect(link).toHaveAttribute("target", "_blank");
});

test("sends the form, emails the team and the user, and can be reset", async ({ page }, testInfo) => {
    const email = uniqueEmail(testInfo.testId);
    await fillValidForm(page, email);
    await form(page).getByRole("button", { name: "Enviar datos" }).click();

    const success = page.getByRole("status").filter({ hasText: "Gracias. Recibimos tus datos correctamente." });
    await expect(success).toBeVisible();
    await expect(success).toBeFocused();

    await expect.poll(async () => (await readMailbox()).filter((mail) => mail.raw.includes(email))).toHaveLength(2);
    const mails = (await readMailbox()).filter((mail) => mail.raw.includes(email));
    const owner = mails.find((mail) => mail.to.includes("landing@e2e.test"));
    const confirmation = mails.find((mail) => mail.to.includes(email));
    expect(owner?.raw).toContain("Subject: Nuevo mensaje de Ana Prueba desde el formulario");
    expect(owner?.raw).toContain(`Reply-To: ${email}`);
    expect(confirmation?.raw).toContain("Subject: Recibimos tu mensaje | Rock Experience");

    await page.getByRole("button", { name: "Enviar otra respuesta" }).click();
    const contact = form(page);
    await expect(contact.getByLabel("Nombre")).toBeFocused();
    await expect(contact.getByLabel("Nombre")).toHaveValue("");
    await expect(contact.getByRole("checkbox", { name: /aviso de privacidad/ })).not.toBeChecked();
});

test("shows a general error when the email cannot be delivered", async ({ page }, testInfo) => {
    await fillValidForm(page, uniqueEmail(testInfo.testId), `Mensaje ${REJECT_MARKER}`);
    await form(page).getByRole("button", { name: "Enviar datos" }).click();

    await expect(form(page).getByRole("alert")).toHaveText(
        "No pudimos enviar tus datos. Inténtalo de nuevo en unos minutos.",
    );
    await expect(form(page).getByRole("button", { name: "Enviar datos" })).toBeEnabled();
    await expect(form(page).getByLabel("Nombre")).toHaveValue("Ana Prueba");
});
