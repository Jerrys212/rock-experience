import { describe, expect, it } from "vitest";
import { ContactSchema, sanitizeName, sanitizePhone, type ContactField, type ContactFormValues } from "./schema";

const valid: ContactFormValues = {
    name: "Ana López",
    email: "ana@empresa.com",
    phone: "55 1234 5678",
    company: "Rock Co",
    message: "Queremos una activación para nuestro lanzamiento.",
    privacy: true,
    website: "",
};

const errorsFor = (overrides: Partial<ContactFormValues>, field: ContactField) => {
    const result = ContactSchema.safeParse({ ...valid, ...overrides });
    if (result.success) return [];
    return result.error.issues.filter((issue) => issue.path[0] === field).map((issue) => issue.message);
};

describe("ContactSchema", () => {
    it("accepts valid data and normalizes it", () => {
        const result = ContactSchema.safeParse({ ...valid, name: "  Ana  ", email: "  Ana@Empresa.COM " });
        expect(result.success).toBe(true);
        expect(result.data?.name).toBe("Ana");
        expect(result.data?.email).toBe("ana@empresa.com");
    });

    describe("name", () => {
        it("rejects a single character", () => {
            expect(errorsFor({ name: "A" }, "name")).toEqual(["Escribe tu nombre (mínimo 2 caracteres)."]);
        });

        it("rejects whitespace only", () => {
            expect(errorsFor({ name: "   " }, "name")).toHaveLength(1);
        });

        it("rejects numbers", () => {
            expect(errorsFor({ name: "Ana 2" }, "name")).toEqual(["Tu nombre no puede contener números."]);
        });

        it("accepts accents, apostrophes and hyphens", () => {
            expect(errorsFor({ name: "José María O'Neil-Pérez" }, "name")).toEqual([]);
        });

        it("rejects more than 80 characters", () => {
            expect(errorsFor({ name: "a".repeat(81) }, "name")).toHaveLength(1);
        });
    });

    describe("email", () => {
        it("rejects an email without @", () => {
            expect(errorsFor({ email: "ana.empresa.com" }, "email")).toEqual([
                "Escribe un correo válido, por ejemplo nombre@empresa.com.",
            ]);
        });

        it("rejects an empty email", () => {
            expect(errorsFor({ email: "" }, "email")).toHaveLength(1);
        });
    });

    describe("phone", () => {
        it("rejects letters", () => {
            expect(errorsFor({ phone: "55 12ab 5678" }, "phone")).toEqual([
                "El teléfono solo puede contener números, espacios, guiones y paréntesis.",
            ]);
        });

        it("rejects a country code prefix", () => {
            expect(errorsFor({ phone: "+52 55 1234 5678" }, "phone")).toHaveLength(1);
        });

        it("rejects 8 digits", () => {
            expect(errorsFor({ phone: "1234 5678" }, "phone")).toEqual(["El teléfono debe tener 10 dígitos."]);
        });

        it("rejects 11 digits", () => {
            expect(errorsFor({ phone: "55 1234 56789" }, "phone")).toEqual(["El teléfono debe tener 10 dígitos."]);
        });

        it("rejects an empty phone", () => {
            expect(errorsFor({ phone: "" }, "phone")).toEqual(["El teléfono debe tener 10 dígitos."]);
        });

        it("accepts 10 digits with parentheses, spaces and dashes", () => {
            expect(errorsFor({ phone: "(55) 1234-5678" }, "phone")).toEqual([]);
            expect(errorsFor({ phone: "5512345678" }, "phone")).toEqual([]);
        });
    });

    describe("company", () => {
        it("accepts an empty company", () => {
            expect(errorsFor({ company: "" }, "company")).toEqual([]);
        });

        it("rejects more than 100 characters", () => {
            expect(errorsFor({ company: "a".repeat(101) }, "company")).toHaveLength(1);
        });
    });

    describe("message", () => {
        it("rejects an empty message", () => {
            expect(errorsFor({ message: "   " }, "message")).toEqual(["Escribe un mensaje."]);
        });

        it("rejects more than 1000 characters", () => {
            expect(errorsFor({ message: "a".repeat(1001) }, "message")).toHaveLength(1);
        });
    });

    describe("privacy", () => {
        it("rejects false", () => {
            expect(errorsFor({ privacy: false }, "privacy")).toEqual([
                "Debes aceptar el aviso de privacidad para continuar.",
            ]);
        });
    });

    describe("website", () => {
        it("rejects a filled honeypot", () => {
            expect(errorsFor({ website: "https://spam.example" }, "website")).toHaveLength(1);
        });
    });
});

describe("sanitizePhone", () => {
    it("keeps a valid 10-digit number untouched", () => {
        expect(sanitizePhone("(55) 1234-5678")).toBe("(55) 1234-5678");
    });

    it("removes letters, + and other symbols", () => {
        expect(sanitizePhone("+55 12ab34.56#78")).toBe("55 12345678");
    });

    it("drops digits beyond the 10th but keeps formatting characters", () => {
        expect(sanitizePhone("123456789012345")).toBe("1234567890");
        expect(sanitizePhone("55 1234 5678 99")).toBe("55 1234 5678 ");
    });
});

describe("sanitizeName", () => {
    it("removes digits and keeps everything else", () => {
        expect(sanitizeName("Ana 123 López")).toBe("Ana  López");
        expect(sanitizeName("José María")).toBe("José María");
    });
});
