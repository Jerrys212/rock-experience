import { contactEmails } from "@/content/contact-emails";
import type { ContactInput } from "./schema";

type EmailContent = {
    subject: string;
    text: string;
    html: string;
};

const HTML_ESCAPES: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
};

export function escapeHtml(value: string) {
    return value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char] ?? char);
}

const toHtmlParagraphs = (value: string) => escapeHtml(value).replace(/\r?\n/g, "<br>");

function layout(body: string) {
    return `<!doctype html><html lang="es"><body style="margin:0;padding:24px;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;color:#18181b;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:8px;"><tr><td style="padding:24px 32px;background:#000000;border-radius:8px 8px 0 0;color:#ffffff;font-size:18px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;">${escapeHtml(contactEmails.brand)}</td></tr><tr><td style="padding:32px;font-size:15px;line-height:1.6;">${body}</td></tr></table></body></html>`;
}

function summaryRows(data: ContactInput) {
    const { labels, emptyValue } = contactEmails.owner;
    return [
        { label: labels.name, value: data.name },
        { label: labels.email, value: data.email },
        { label: labels.phone, value: data.phone },
        { label: labels.company, value: data.company || emptyValue },
        { label: labels.message, value: data.message },
    ];
}

function summaryHtml(data: ContactInput) {
    const rows = summaryRows(data)
        .map(
            ({ label, value }) =>
                `<tr><td style="padding:8px 16px 8px 0;vertical-align:top;color:#5b2eff;font-weight:bold;white-space:nowrap;">${escapeHtml(label)}</td><td style="padding:8px 0;">${toHtmlParagraphs(value)}</td></tr>`,
        )
        .join("");
    return `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-top:1px solid #e4e4e7;margin-top:16px;">${rows}</table>`;
}

const summaryText = (data: ContactInput) =>
    summaryRows(data)
        .map(({ label, value }) => `${label}: ${value}`)
        .join("\n");

export function buildOwnerEmail(data: ContactInput): EmailContent {
    const { owner } = contactEmails;
    return {
        subject: owner.subject(data.name),
        text: `${owner.heading}\n\n${owner.intro}\n\n${summaryText(data)}`,
        html: layout(
            `<h1 style="margin:0 0 8px;font-size:20px;">${escapeHtml(owner.heading)}</h1><p style="margin:0;color:#52525b;">${escapeHtml(owner.intro)}</p>${summaryHtml(data)}`,
        ),
    };
}

export function buildConfirmationEmail(data: ContactInput): EmailContent {
    const { confirmation } = contactEmails;
    const greeting = confirmation.greeting(data.name);
    return {
        subject: confirmation.subject,
        text: `${greeting}\n\n${confirmation.body}\n\n${confirmation.summaryTitle}\n${summaryText(data)}\n\n${confirmation.signature}`,
        html: layout(
            `<p style="margin:0 0 16px;">${escapeHtml(greeting)}</p><p style="margin:0 0 24px;">${escapeHtml(confirmation.body)}</p><p style="margin:0;font-weight:bold;">${escapeHtml(confirmation.summaryTitle)}</p>${summaryHtml(data)}<p style="margin:24px 0 0;">${escapeHtml(confirmation.signature)}</p>`,
        ),
    };
}
