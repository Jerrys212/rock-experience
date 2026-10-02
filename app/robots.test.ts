import { describe, expect, it } from "vitest";
import { site } from "@/lib/site";
import robots from "./robots";

describe("robots", () => {
    it("allows the site, blocks the API and points to the sitemap", () => {
        expect(robots()).toEqual({
            rules: { userAgent: "*", allow: "/", disallow: "/api/" },
            sitemap: new URL("/sitemap.xml", site.url).href,
        });
    });
});
