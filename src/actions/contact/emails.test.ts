import { describe, expect, it } from "vitest";
import { buildConfirmationEmail, buildOwnerEmail, escapeHtml } from "./emails";
import type { ContactInput } from "./schema";

const data: ContactInput = {
    name: "Ana <script>",
    email: "ana@empresa.com",
    phone: "55 1234 5678",
    company: "",
    message: "Hola\nQueremos \"algo\" & más",
    privacy: true,
    website: "",
};

describe("escapeHtml", () => {
    it("escapes HTML special characters", () => {
        expect(escapeHtml(`<a href="x">'&'</a>`)).toBe("&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;");
    });
});

describe("buildOwnerEmail", () => {
    const email = buildOwnerEmail(data);

    it("includes every field and marks an empty company", () => {
        expect(email.subject).toContain("Ana <script>");
        expect(email.text).toContain("ana@empresa.com");
        expect(email.text).toContain("55 1234 5678");
        expect(email.text).toContain("Empresa: No indicada");
    });

    it("escapes user input in the HTML body", () => {
        expect(email.html).not.toContain("<script>");
        expect(email.html).toContain("Ana &lt;script&gt;");
        expect(email.html).toContain("Hola<br>Queremos &quot;algo&quot; &amp; más");
    });
});

describe("buildConfirmationEmail", () => {
    const email = buildConfirmationEmail(data);

    it("confirms the message was sent and greets the user", () => {
        expect(email.text).toContain("Hola, Ana <script>:");
        expect(email.text).toContain("se envió con éxito");
        expect(email.html).not.toContain("<script>");
    });
});
