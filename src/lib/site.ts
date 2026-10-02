import { env } from "./env";

export const site = {
  name: "Rock Experience",
  description: "Vive el rock en vivo desde el escenario.",
  locale: "es",
  url: env.NEXT_PUBLIC_SITE_URL,
} as const;
