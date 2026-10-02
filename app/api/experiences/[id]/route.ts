import { ExperienceIdSchema } from "@/content/experiences";
import { getExperience } from "@/lib/experiences";

export async function GET(_request: Request, { params }: RouteContext<"/api/experiences/[id]">) {
    const { id } = await params;
    const parsedId = ExperienceIdSchema.safeParse(id);
    if (!parsedId.success) {
        return Response.json({ error: "El identificador de la experiencia no es válido." }, { status: 400 });
    }

    try {
        const experience = await getExperience(parsedId.data);
        if (!experience) {
            return Response.json({ error: "No encontramos esta experiencia." }, { status: 404 });
        }
        return Response.json(experience);
    } catch (error) {
        console.error(`[api/experiences/${parsedId.data}] Failed to load experience`, error);
        return Response.json({ error: "No pudimos cargar esta experiencia." }, { status: 500 });
    }
}
