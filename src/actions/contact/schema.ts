import { z } from "zod";

const PHONE_PATTERN = /^[\d\s()-]+$/;
const PHONE_DISALLOWED_CHARS = /[^\d\s()-]/g;
const PHONE_DIGITS = 10;

const countDigits = (value: string) => value.replace(/\D/g, "").length;

export const sanitizeName = (value: string) => value.replace(/\d/g, "");

export function sanitizePhone(value: string) {
    let digits = 0;
    return [...value.replace(PHONE_DISALLOWED_CHARS, "")]
        .filter((char) => !/\d/.test(char) || ++digits <= PHONE_DIGITS)
        .join("");
}

const nameError = "Escribe tu nombre (mínimo 2 caracteres).";
const emailError = "Escribe un correo válido, por ejemplo nombre@empresa.com.";
const phoneCharsError = "El teléfono solo puede contener números, espacios, guiones y paréntesis.";
const phoneLengthError = "El teléfono debe tener 10 dígitos.";
const messageError = "Escribe un mensaje.";
const privacyError = "Debes aceptar el aviso de privacidad para continuar.";

export const ContactSchema = z.object({
    name: z
        .string({ error: nameError })
        .trim()
        .min(2, { error: nameError })
        .max(80, { error: "Tu nombre no puede superar los 80 caracteres." })
        .refine((value) => !/\d/.test(value), { error: "Tu nombre no puede contener números." }),
    email: z.string({ error: emailError }).trim().toLowerCase().pipe(z.email({ error: emailError })),
    phone: z
        .string({ error: phoneLengthError })
        .trim()
        .refine((value) => value === "" || PHONE_PATTERN.test(value), { error: phoneCharsError, abort: true })
        .refine((value) => countDigits(value) === PHONE_DIGITS, { error: phoneLengthError }),
    company: z.string().trim().max(100, { error: "El nombre de la empresa no puede superar los 100 caracteres." }),
    message: z
        .string({ error: messageError })
        .trim()
        .min(1, { error: messageError })
        .max(1000, { error: "El mensaje no puede superar los 1000 caracteres." }),
    privacy: z.boolean({ error: privacyError }).refine((accepted) => accepted, { error: privacyError }),
    website: z.string().max(0),
});

export type ContactFormValues = z.input<typeof ContactSchema>;
export type ContactInput = z.infer<typeof ContactSchema>;
export type ContactField = keyof ContactInput;
