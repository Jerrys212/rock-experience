import { beforeEach, describe, expect, it, vi } from "vitest";
import { getExperience } from "@/lib/experiences";
import { GET } from "./route";

vi.mock("@/lib/experiences", () => ({ getExperience: vi.fn() }));

const request = new Request("http://localhost/api/experiences");
const call = (id: string) => GET(request, { params: Promise.resolve({ id }) });

describe("GET /api/experiences/[id]", () => {
    beforeEach(() => {
        vi.mocked(getExperience).mockReset();
        vi.spyOn(console, "error").mockImplementation(() => {});
    });

    it("returns the experience", async () => {
        vi.mocked(getExperience).mockResolvedValue({
            id: 1,
            title: "A",
            category: "B",
            description: "C",
            image: "https://x.dev/a.jpg",
            details: { summary: "S", format: "F", duration: "D", capacity: "C", location: "L", highlights: ["H"] },
        });

        const response = await call("1");

        expect(response.status).toBe(200);
        await expect(response.json()).resolves.toMatchObject({ id: 1, title: "A" });
        expect(getExperience).toHaveBeenCalledWith(1);
    });

    it.each(["abc", "0", "1.0"])("returns 400 for the invalid id %j", async (id) => {
        const response = await call(id);

        expect(response.status).toBe(400);
        expect(getExperience).not.toHaveBeenCalled();
    });

    it("returns 404 when the experience does not exist", async () => {
        vi.mocked(getExperience).mockResolvedValue(undefined);

        const response = await call("99");

        expect(response.status).toBe(404);
        await expect(response.json()).resolves.toEqual({ error: "No encontramos esta experiencia." });
    });

    it("returns 500 when loading fails", async () => {
        vi.mocked(getExperience).mockRejectedValue(new Error("disk"));

        const response = await call("1");

        expect(response.status).toBe(500);
        expect(console.error).toHaveBeenCalled();
    });
});
