import type { Metadata } from "next";
import { ExperienceIdSchema } from "@/content/experiences";
import { getExperience } from "@/lib/experiences";
import { site } from "@/lib/site";
import { ExperienceDetailPage } from "@/sections/experiences/experience-detail-page";

export async function generateMetadata({ params }: PageProps<"/experiencias/[id]">): Promise<Metadata> {
    const parsedId = ExperienceIdSchema.safeParse((await params).id);
    const experience = parsedId.success ? await getExperience(parsedId.data).catch(() => undefined) : undefined;
    if (!experience) return {};
    return {
        title: experience.title,
        description: experience.description,
        alternates: { canonical: `/experiencias/${experience.id}` },
        openGraph: {
            type: "article",
            siteName: site.name,
            locale: site.ogLocale,
            url: `/experiencias/${experience.id}`,
            title: experience.title,
            description: experience.description,
            images: [experience.image],
        },
        twitter: {
            card: "summary_large_image",
            title: experience.title,
            description: experience.description,
            images: [experience.image],
        },
    };
}

export default function ExperienceRoute({ params, searchParams }: PageProps<"/experiencias/[id]">) {
    return <ExperienceDetailPage params={params} searchParams={searchParams} />;
}
