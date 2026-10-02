import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Static shell (hero, headings) prerendered at build; data sections stream in at request time.
    cacheComponents: true,
    images: {
        // Placeholder photos for the experiences grid; picsum redirects to fastly.picsum.photos.
        remotePatterns: [
            { protocol: "https", hostname: "picsum.photos" },
            { protocol: "https", hostname: "fastly.picsum.photos" },
        ],
    },
};

export default nextConfig;
