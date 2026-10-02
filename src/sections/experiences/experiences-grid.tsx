import { connection } from "next/server";
import { experiencesSection, type Experience } from "@/content/experiences";
import { getExperiences } from "@/lib/experiences";
import { ExperienceCard } from "./experience-card";
import { ExperiencesError } from "./experiences-error";
import { applySimulation, type SearchParams } from "./simulation";

export const gridClassName = "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8";

export async function ExperiencesGrid({ searchParams }: { searchParams: SearchParams }) {
    await connection();

    let experiences: Experience[];
    try {
        await applySimulation(searchParams);
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
