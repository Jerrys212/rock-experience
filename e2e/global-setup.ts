import { appendFile, writeFile } from "node:fs/promises";
import { SMTPServer } from "smtp-server";
import { MAILBOX_FILE, REJECT_MARKER, SMTP_PORT } from "./mailbox";

export default async function globalSetup() {
    await writeFile(MAILBOX_FILE, "");

    const server = new SMTPServer({
        authOptional: true,
        allowInsecureAuth: true,
        disabledCommands: ["STARTTLS"],
        logger: false,
        onAuth: (auth, _session, callback) => callback(null, { user: auth.username }),
        onData: (stream, session, callback) => {
            const chunks: Buffer[] = [];
            stream.on("data", (chunk: Buffer) => chunks.push(chunk));
            stream.on("end", () => {
                const raw = Buffer.concat(chunks).toString("utf8");
                if (raw.includes(REJECT_MARKER)) {
                    callback(Object.assign(new Error("Rejected by the e2e SMTP server"), { responseCode: 550 }));
                    return;
                }
                const mail = {
                    from: session.envelope.mailFrom ? session.envelope.mailFrom.address : "",
                    to: session.envelope.rcptTo.map((recipient) => recipient.address),
                    raw,
                };
                appendFile(MAILBOX_FILE, `${JSON.stringify(mail)}\n`).then(() => callback(), callback);
            });
        },
    });

    await new Promise<void>((resolve) => server.listen(SMTP_PORT, "127.0.0.1", resolve));

    return () => new Promise<void>((resolve) => server.close(() => resolve()));
}
