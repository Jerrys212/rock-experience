import { connection } from "next/server";
import { ExperienceIdSchema, type ExperienceDetail as ExperienceDetailData } from "@/content/experiences";
import { getExperience } from "@/lib/experiences";
import { ExperienceDetail } from "./experience-detail";
import { ExperienceDetailMessage } from "./experience-detail-message";
import { applySimulation, type SearchParams } from "./simulation";

type ExperienceDetailLoaderProps = {
    params: Promise<{ id: string }>;
    searchParams: SearchParams;
    headingLevel: "h1" | "h2";
};

export async function ExperienceDetailLoader({ params, searchParams, headingLevel }: ExperienceDetailLoaderProps) {
    await connection();
    const { id } = await params;
    const parsedId = ExperienceIdSchema.safeParse(id);
    if (!parsedId.success) {
        return <ExperienceDetailMessage variant="notFound" headingLevel={headingLevel} />;
    }

    let experience: ExperienceDetailData | undefined;
    try {
        await applySimulation(searchParams);
        experience = await getExperience(parsedId.data);
    } catch (error) {
        console.error(`[experiences/${parsedId.data}] Failed to load experience`, error);
        return <ExperienceDetailMessage variant="error" headingLevel={headingLevel} />;
    }

    if (!experience) {
        return <ExperienceDetailMessage variant="notFound" headingLevel={headingLevel} />;
    }

    return <ExperienceDetail experience={experience} headingLevel={headingLevel} />;
}
