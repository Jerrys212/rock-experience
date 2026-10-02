import type { MetadataRoute } from "next";
import { getExperiences } from "@/lib/experiences";
import { site } from "@/lib/site";

async function getExperienceUrls() {
    "use cache";
    const experiences = await getExperiences();
    return experiences.map((experience) => new URL(`/experiencias/${experience.id}`, site.url).toString());
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const experienceUrls = await getExperienceUrls();
    return [
        { url: site.url, changeFrequency: "monthly", priority: 1 },
        ...experienceUrls.map((url) => ({ url, changeFrequency: "monthly" as const, priority: 0.6 })),
        { url: new URL("/aviso-de-privacidad", site.url).toString(), changeFrequency: "yearly", priority: 0.3 },
    ];
}
