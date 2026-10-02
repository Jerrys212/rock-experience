import { z } from "zod";

export const ExperienceSchema = z.object({
    id: z.number().int().positive(),
    title: z.string().min(1),
    category: z.string().min(1),
    description: z.string().min(1),
    image: z.url(),
});

export const ExperiencesSchema = z.array(ExperienceSchema);

export type Experience = z.infer<typeof ExperienceSchema>;

export const experiencesSection = {
    title: "Experiencias",
    states: {
        loading: "Cargando experiencias…",
        empty: "Pronto anunciaremos nuevas experiencias. Vuelve en unos días.",
        error: {
            title: "No pudimos cargar las experiencias",
            description: "Revisa tu conexión e inténtalo de nuevo en unos segundos.",
            retry: "Reintentar",
            retrying: "Reintentando…",
        },
    },
};
