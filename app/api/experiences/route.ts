import { getExperiences } from "@/lib/experiences";

export async function GET() {
    try {
        const experiences = await getExperiences();
        return Response.json(experiences);
    } catch (error) {
        console.error("[api/experiences] Failed to load experiences", error);
        return Response.json({ error: "No pudimos cargar las experiencias." }, { status: 500 });
    }
}
