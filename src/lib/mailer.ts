import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { z } from "zod";
import { getMailEnv } from "./env";

export type MailMessage = {
    to: string;
    subject: string;
    text: string;
    html: string;
    replyTo?: string;
};

const SentMailSchema = z.object({
    messageId: z.string(),
    accepted: z.array(z.unknown()).min(1),
    rejected: z.array(z.unknown()).length(0),
});

let transporter: Transporter | undefined;

function getTransporter() {
    if (transporter) return transporter;
    const mailEnv = getMailEnv();
    transporter = nodemailer.createTransport({
        host: mailEnv.SMTP_HOST,
        port: mailEnv.SMTP_PORT,
        secure: mailEnv.SMTP_PORT === 465,
        auth: { user: mailEnv.SMTP_USER, pass: mailEnv.SMTP_PASS },
    });
    return transporter;
}

export function getMailSender() {
    return getMailEnv().SMTP_EMAIL_FROM;
}

export async function sendMail(message: MailMessage) {
    const info: unknown = await getTransporter().sendMail({
        from: { name: "Rock Experience", address: getMailSender() },
        ...message,
    });
    return SentMailSchema.parse(info);
}
