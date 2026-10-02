import nodemailer from "nodemailer";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getMailEnv, type MailEnv } from "./env";

vi.mock("server-only", () => ({}));
vi.mock("nodemailer", () => ({ default: { createTransport: vi.fn() } }));
vi.mock("./env", async (importOriginal) => ({
    ...(await importOriginal<typeof import("./env")>()),
    getMailEnv: vi.fn(),
}));

const mailEnv: MailEnv = {
    SMTP_HOST: "smtp.example.com",
    SMTP_PORT: 587,
    SMTP_USER: "user",
    SMTP_PASS: "pass",
    SMTP_EMAIL_FROM: "landing@rockexperience.mx",
};

const message = { to: "ana@empresa.com", subject: "Hola", text: "Hola", html: "<p>Hola</p>" };

const transportSendMail = vi.fn();

async function loadMailer() {
    vi.resetModules();
    return import("./mailer");
}

describe("mailer", () => {
    beforeEach(() => {
        vi.mocked(getMailEnv).mockReturnValue(mailEnv);
        vi.mocked(nodemailer.createTransport).mockReset().mockReturnValue({ sendMail: transportSendMail } as never);
        transportSendMail.mockReset().mockResolvedValue({ messageId: "abc", accepted: [message.to], rejected: [] });
    });

    it("returns the configured sender address", async () => {
        const { getMailSender } = await loadMailer();
        expect(getMailSender()).toBe("landing@rockexperience.mx");
    });

    it("sends from the site name and sender address", async () => {
        const { sendMail } = await loadMailer();

        await expect(sendMail(message)).resolves.toMatchObject({ messageId: "abc" });
        expect(transportSendMail).toHaveBeenCalledWith({
            from: { name: "Rock Experience", address: "landing@rockexperience.mx" },
            ...message,
        });
    });

    it("creates the transport once and reuses it", async () => {
        const { sendMail } = await loadMailer();

        await sendMail(message);
        await sendMail(message);

        expect(nodemailer.createTransport).toHaveBeenCalledTimes(1);
        expect(nodemailer.createTransport).toHaveBeenCalledWith({
            host: "smtp.example.com",
            port: 587,
            secure: false,
            auth: { user: "user", pass: "pass" },
        });
    });

    it("uses implicit TLS on port 465", async () => {
        vi.mocked(getMailEnv).mockReturnValue({ ...mailEnv, SMTP_PORT: 465 });
        const { sendMail } = await loadMailer();

        await sendMail(message);

        expect(nodemailer.createTransport).toHaveBeenCalledWith(expect.objectContaining({ secure: true }));
    });

    it("fails when the server rejects a recipient", async () => {
        transportSendMail.mockResolvedValue({ messageId: "abc", accepted: [], rejected: [message.to] });
        const { sendMail } = await loadMailer();

        await expect(sendMail(message)).rejects.toThrow();
    });

    it("fails when the transport returns an unexpected response", async () => {
        transportSendMail.mockResolvedValue({ ok: true });
        const { sendMail } = await loadMailer();

        await expect(sendMail(message)).rejects.toThrow();
    });
});
