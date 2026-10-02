import { describe, expect, it } from "vitest";
import { getExperiences } from "@/lib/experiences";
import { site } from "@/lib/site";
import sitemap from "./sitemap";

describe("sitemap", () => {
    it("lists the home, every experience and the privacy notice", async () => {
        const urls = (await sitemap()).map((entry) => entry.url);
        const experienceUrls = (await getExperiences()).map(({ id }) => new URL(`/experiencias/${id}`, site.url).href);

        expect(urls).toEqual([site.url, ...experienceUrls, new URL("/aviso-de-privacidad", site.url).href]);
    });
});
