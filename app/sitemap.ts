import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        { url: site.url, changeFrequency: "monthly", priority: 1 },
        { url: new URL("/aviso-de-privacidad", site.url).toString(), changeFrequency: "yearly", priority: 0.3 },
    ];
}
