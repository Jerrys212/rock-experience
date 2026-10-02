import { readFile } from "node:fs/promises";
import path from "node:path";
import { ExperiencesSchema, type Experience } from "@/content/experiences";

const DATA_PATH = path.join(process.cwd(), "src/content/experiences.json");

export async function getExperiences(): Promise<Experience[]> {
    const raw: unknown = JSON.parse(await readFile(DATA_PATH, "utf8"));
    return ExperiencesSchema.parse(raw);
}
