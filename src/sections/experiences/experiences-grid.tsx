import { connection } from "next/server";
import { experiencesSection, type Experience } from "@/content/experiences";
import { env } from "@/lib/env";
import { getExperiences } from "@/lib/experiences";
import { ExperienceCard } from "./experience-card";
import { ExperiencesError } from "./experiences-error";

export type ExperiencesSearchParams = Promise<Record<string, string | string[] | undefined>>;

export const gridClassName = "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8";

const SIMULATED_DELAY_MS = 4000;

async function getSimulation(searchParams: ExperiencesSearchParams) {
    if (env.NODE_ENV !== "development") return undefined;
    const { simular } = await searchParams;
    return simular === "carga" || simular === "error" ? simular : undefined;
}

export async function ExperiencesGrid({ searchParams }: { searchParams: ExperiencesSearchParams }) {
    await connection();
    const simulation = await getSimulation(searchParams);

    let experiences: Experience[];
    try {
        if (simulation === "carga") await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));
        if (simulation === "error") throw new Error("Simulated failure (?simular=error)");
        experiences = await getExperiences();
    } catch (error) {
        console.error("[experiences] Failed to load experiences", error);
        return <ExperiencesError />;
    }

    if (experiences.length === 0) {
        return <p className="text-center text-base text-white/70">{experiencesSection.states.empty}</p>;
    }

    return (
        <ul className={gridClassName}>
            {experiences.map((experience) => (
                <li key={experience.id}>
                    <ExperienceCard experience={experience} />
                </li>
            ))}
        </ul>
    );
}
