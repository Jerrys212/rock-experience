import { beforeEach, describe, expect, it, vi } from "vitest";
import { getExperiences } from "@/lib/experiences";
import { GET } from "./route";

vi.mock("@/lib/experiences", () => ({ getExperiences: vi.fn() }));

describe("GET /api/experiences", () => {
    beforeEach(() => {
        vi.spyOn(console, "error").mockImplementation(() => {});
    });

    it("returns the experiences as JSON", async () => {
        const experiences = [{ id: 1, title: "A", category: "B", description: "C", image: "https://x.dev/a.jpg" }];
        vi.mocked(getExperiences).mockResolvedValue(experiences);

        const response = await GET();

        expect(response.status).toBe(200);
        await expect(response.json()).resolves.toEqual(experiences);
    });

    it("returns a 500 with a Spanish message when loading fails", async () => {
        vi.mocked(getExperiences).mockRejectedValue(new Error("disk"));

        const response = await GET();

        expect(response.status).toBe(500);
        await expect(response.json()).resolves.toEqual({ error: "No pudimos cargar las experiencias." });
        expect(console.error).toHaveBeenCalled();
    });
});
