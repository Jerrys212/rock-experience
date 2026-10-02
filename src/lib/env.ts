import { z } from "zod";

const EnvSchema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
});

const MailEnvSchema = z.object({
    SMTP_HOST: z.string().min(1),
    SMTP_PORT: z.coerce.number().int().positive(),
    SMTP_USER: z.string().min(1),
    SMTP_PASS: z.string().min(1),
    SMTP_EMAIL_FROM: z.email(),
});

export type MailEnv = z.infer<typeof MailEnvSchema>;

export const env = EnvSchema.parse({
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});

// Parsed on demand so pages that never send mail don't require SMTP credentials.
export function getMailEnv(): MailEnv {
    return MailEnvSchema.parse({
        SMTP_HOST: process.env.SMTP_HOST,
        SMTP_PORT: process.env.SMTP_PORT,
        SMTP_USER: process.env.SMTP_USER,
        SMTP_PASS: process.env.SMTP_PASS,
        SMTP_EMAIL_FROM: process.env.SMTP_EMAIL_FROM,
    });
}
