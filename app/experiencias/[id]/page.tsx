import type { Metadata } from "next";
import { ExperienceIdSchema } from "@/content/experiences";
import { getExperience } from "@/lib/experiences";
import { site } from "@/lib/site";
import { ExperienceDetailPage } from "@/sections/experiences/experience-detail-page";

export async function generateMetadata({ params }: PageProps<"/experiencias/[id]">): Promise<Metadata> {
    const parsedId = ExperienceIdSchema.safeParse((await params).id);
    const experience = parsedId.success ? await getExperience(parsedId.data).catch(() => undefined) : undefined;
    return experience
        ? { title: `${experience.title} | ${site.name}`, description: experience.description }
        : { title: site.name };
}

export default function ExperienceRoute({ params, searchParams }: PageProps<"/experiencias/[id]">) {
    return <ExperienceDetailPage params={params} searchParams={searchParams} />;
}
