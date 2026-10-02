import { afterEach, describe, expect, it, vi } from "vitest";
import { getMailEnv } from "./env";

const smtp = {
    SMTP_HOST: "smtp.example.com",
    SMTP_PORT: "587",
    SMTP_USER: "user",
    SMTP_PASS: "pass",
    SMTP_EMAIL_FROM: "landing@rockexperience.mx",
};

const stubSmtp = (overrides: Partial<Record<keyof typeof smtp, string>> = {}) => {
    Object.entries({ ...smtp, ...overrides }).forEach(([key, value]) => vi.stubEnv(key, value));
};

describe("getMailEnv", () => {
    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it("parses the SMTP settings and coerces the port", () => {
        stubSmtp();
        expect(getMailEnv()).toEqual({ ...smtp, SMTP_PORT: 587 });
    });

    it("throws when a setting is missing", () => {
        stubSmtp({ SMTP_PASS: "" });
        expect(() => getMailEnv()).toThrow();
    });

    it("throws when the port is not a positive integer", () => {
        stubSmtp({ SMTP_PORT: "abc" });
        expect(() => getMailEnv()).toThrow();
    });

    it("throws when the sender is not an email", () => {
        stubSmtp({ SMTP_EMAIL_FROM: "landing" });
        expect(() => getMailEnv()).toThrow();
    });
});
