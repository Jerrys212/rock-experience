import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import {
    ExperienceDetailListSchema,
    ExperiencesSchema,
    type Experience,
    type ExperienceDetail,
} from "@/content/experiences";

const DATA_PATH = path.join(process.cwd(), "src/content/experiences.json");

async function readExperiencesFile(): Promise<unknown> {
    return JSON.parse(await readFile(DATA_PATH, "utf8"));
}

export async function getExperiences(): Promise<Experience[]> {
    return ExperiencesSchema.parse(await readExperiencesFile());
}

export const getExperience = cache(async (id: number): Promise<ExperienceDetail | undefined> => {
    const experiences = ExperienceDetailListSchema.parse(await readExperiencesFile());
    return experiences.find((experience) => experience.id === id);
});
