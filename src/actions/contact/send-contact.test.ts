import { beforeEach, describe, expect, it, vi } from "vitest";
import { getMailSender, sendMail } from "@/lib/mailer";
import type { ContactFormValues } from "./schema";
import { sendContact } from "./send-contact";

vi.mock("@/lib/mailer", () => ({
    getMailSender: vi.fn(() => "landing@rockexperience.mx"),
    sendMail: vi.fn(),
}));

const valid: ContactFormValues = {
    name: "Ana López",
    email: "  Ana@Empresa.com ",
    phone: "55 1234 5678",
    company: "",
    message: "Queremos una activación.",
    privacy: true,
    website: "",
};

describe("sendContact", () => {
    beforeEach(() => {
        vi.mocked(sendMail).mockReset().mockResolvedValue({ messageId: "1", accepted: ["x"], rejected: [] });
        vi.spyOn(console, "error").mockImplementation(() => {});
    });

    it("sends the owner notification and the user confirmation", async () => {
        await expect(sendContact(valid)).resolves.toEqual({ success: true });

        expect(sendMail).toHaveBeenCalledTimes(2);
        const [owner, confirmation] = vi.mocked(sendMail).mock.calls.map(([message]) => message);
        expect(owner).toMatchObject({ to: getMailSender(), replyTo: "ana@empresa.com" });
        expect(owner?.subject).toContain("Ana López");
        expect(confirmation).toMatchObject({ to: "ana@empresa.com" });
        expect(confirmation?.replyTo).toBeUndefined();
    });

    it("returns field errors without sending anything when the input is invalid", async () => {
        const result = await sendContact({ ...valid, name: "A", phone: "123", privacy: false });

        expect(result).toMatchObject({ success: false, reason: "validation" });
        if (result.success || result.reason !== "validation") throw new Error("Expected a validation error");
        expect(Object.keys(result.errors).sort()).toEqual(["name", "phone", "privacy"]);
        expect(sendMail).not.toHaveBeenCalled();
    });

    it("rejects input that is not an object", async () => {
        await expect(sendContact("hola")).resolves.toMatchObject({ success: false, reason: "validation" });
        await expect(sendContact(null)).resolves.toMatchObject({ success: false, reason: "validation" });
    });

    it("fakes success for bots that fill the honeypot", async () => {
        await expect(sendContact({ ...valid, website: "https://spam.example" })).resolves.toEqual({ success: true });
        expect(sendMail).not.toHaveBeenCalled();
    });

    it("reports a delivery error when the owner notification fails", async () => {
        vi.mocked(sendMail).mockRejectedValueOnce(new Error("SMTP down"));

        await expect(sendContact(valid)).resolves.toEqual({ success: false, reason: "delivery" });
        expect(sendMail).toHaveBeenCalledTimes(1);
        expect(console.error).toHaveBeenCalledWith(expect.stringContaining("owner notification"), "SMTP down");
    });

    it("still succeeds when only the user confirmation fails", async () => {
        vi.mocked(sendMail)
            .mockResolvedValueOnce({ messageId: "1", accepted: ["x"], rejected: [] })
            .mockRejectedValueOnce("mailbox full");

        await expect(sendContact(valid)).resolves.toEqual({ success: true });
        expect(console.error).toHaveBeenCalledWith(expect.stringContaining("user confirmation"), "mailbox full");
    });
});
