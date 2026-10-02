import { describe, expect, it } from "vitest";
import { getExperience } from "@/lib/experiences";
import { site } from "@/lib/site";
import { generateMetadata } from "./page";

const metadataFor = (id: string) =>
    generateMetadata({ params: Promise.resolve({ id }), searchParams: Promise.resolve({}) });

describe("experience page metadata", () => {
    it("describes the experience for search engines and social cards", async () => {
        const experience = await getExperience(1);
        if (!experience) throw new Error("Fixture experience 1 is missing");

        const metadata = await metadataFor("1");

        expect(metadata).toMatchObject({
            title: experience.title,
            description: experience.description,
            alternates: { canonical: "/experiencias/1" },
            openGraph: {
                type: "article",
                siteName: site.name,
                locale: site.ogLocale,
                title: experience.title,
                images: [experience.image],
            },
            twitter: { card: "summary_large_image", title: experience.title, images: [experience.image] },
        });
    });

    it.each(["999", "abc"])("falls back to the defaults for %j", async (id) => {
        await expect(metadataFor(id)).resolves.toEqual({});
    });
});
