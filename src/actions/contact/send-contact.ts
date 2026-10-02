"use server";

import { z } from "zod";
import { getMailSender, sendMail } from "@/lib/mailer";
import { buildConfirmationEmail, buildOwnerEmail } from "./emails";
import { ContactSchema, type ContactField } from "./schema";

export type SendContactResult =
    | { success: true }
    | { success: false; reason: "validation"; errors: Partial<Record<ContactField, string[]>> }
    | { success: false; reason: "delivery" };

const isHoneypotFilled = (input: unknown) =>
    typeof input === "object" &&
    input !== null &&
    "website" in input &&
    typeof input.website === "string" &&
    input.website.trim() !== "";

const describeError = (error: unknown) => (error instanceof Error ? error.message : String(error));

export async function sendContact(input: unknown): Promise<SendContactResult> {
    if (isHoneypotFilled(input)) return { success: true };

    const parsed = ContactSchema.safeParse(input);
    if (!parsed.success) {
        return { success: false, reason: "validation", errors: z.flattenError(parsed.error).fieldErrors };
    }

    const data = parsed.data;

    try {
        await sendMail({ ...buildOwnerEmail(data), to: getMailSender(), replyTo: data.email });
    } catch (error) {
        console.error("[contact] Failed to deliver the owner notification:", describeError(error));
        return { success: false, reason: "delivery" };
    }

    // The request already reached us, so a failed confirmation shouldn't make the user resend it.
    try {
        await sendMail({ ...buildConfirmationEmail(data), to: data.email });
    } catch (error) {
        console.error("[contact] Failed to deliver the user confirmation:", describeError(error));
    }

    return { success: true };
}
