import { env } from "./env";

export const site = {
    name: "Rock Experience",
    tagline: "Vive algo diferente.",
    description: "Descubre experiencias creadas para conectar marcas, tecnología y personas.",
    locale: "es",
    ogLocale: "es_MX",
    url: env.NEXT_PUBLIC_SITE_URL,
} as const;
