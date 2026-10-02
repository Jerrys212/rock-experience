import { z } from "zod";
import { sectionIds } from "./navigation";

export const ExperienceSchema = z.object({
    id: z.number().int().positive(),
    title: z.string().min(1),
    category: z.string().min(1),
    description: z.string().min(1),
    image: z.url(),
});

export const ExperienceDetailsSchema = z.object({
    summary: z.string().min(1),
    format: z.string().min(1),
    duration: z.string().min(1),
    capacity: z.string().min(1),
    location: z.string().min(1),
    highlights: z.array(z.string().min(1)).min(1),
});

export const ExperienceDetailSchema = ExperienceSchema.extend({
    details: ExperienceDetailsSchema,
});

export const ExperiencesSchema = z.array(ExperienceSchema);
export const ExperienceDetailListSchema = z.array(ExperienceDetailSchema);
export const ExperienceIdSchema = z
    .string()
    .regex(/^[1-9]\d*$/)
    .transform(Number);

export type Experience = z.infer<typeof ExperienceSchema>;
export type ExperienceDetail = z.infer<typeof ExperienceDetailSchema>;

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

export const experienceDetailCopy = {
    labels: {
        format: "Formato",
        duration: "Duración",
        capacity: "Capacidad",
        location: "Ubicación",
    },
    highlightsTitle: "Lo que vivirás",
    cta: { label: "Participa ya", target: sectionIds.contacto },
    close: "Cerrar detalle",
    back: "Volver a experiencias",
    states: {
        loading: "Cargando experiencia…",
        notFound: {
            title: "No encontramos esta experiencia",
            description: "Es posible que ya no esté disponible. Explora las demás experiencias.",
        },
        error: {
            title: "No pudimos cargar esta experiencia",
            description: "Revisa tu conexión e inténtalo de nuevo en unos segundos.",
            retry: "Reintentar",
            retrying: "Reintentando…",
        },
    },
};
