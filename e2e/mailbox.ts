import { readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

export const SMTP_PORT = 2526;
export const MAILBOX_FILE = path.join(os.tmpdir(), "rock-experience-e2e-mailbox.jsonl");
export const REJECT_MARKER = "FALLA-E2E";

export type ReceivedMail = {
    from: string;
    to: string[];
    raw: string;
};

export async function readMailbox(): Promise<ReceivedMail[]> {
    const content = await readFile(MAILBOX_FILE, "utf8").catch(() => "");
    return content
        .split("\n")
        .filter(Boolean)
        .map((line) => JSON.parse(line) as ReceivedMail);
}
