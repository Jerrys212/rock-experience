import { describe, expect, it } from "vitest";
import { getExperience, getExperiences } from "./experiences";

describe("getExperiences", () => {
    it("returns the list without the detail payload", async () => {
        const experiences = await getExperiences();

        expect(experiences.length).toBeGreaterThan(0);
        experiences.forEach((experience) => expect(experience).not.toHaveProperty("details"));
    });

    it("uses unique ids", async () => {
        const ids = (await getExperiences()).map((experience) => experience.id);
        expect(new Set(ids).size).toBe(ids.length);
    });
});

describe("getExperience", () => {
    it("returns an experience with its details", async () => {
        const experience = await getExperience(1);

        expect(experience?.id).toBe(1);
        expect(experience?.details.highlights.length).toBeGreaterThan(0);
    });

    it("returns undefined for an unknown id", async () => {
        await expect(getExperience(9999)).resolves.toBeUndefined();
    });
});
