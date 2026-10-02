import Image from "next/image";

import { hero } from "@/content/hero";
import { sectionIds } from "@/content/navigation";

import { HeroActions } from "./hero-actions";

const TITLE_ID = "hero-title";

export function Hero() {
    return (
        <section
            id={sectionIds.inicio}
            aria-labelledby={TITLE_ID}
            tabIndex={-1}
            className="relative flex min-h-svh w-full scroll-mt-16 overflow-hidden focus:outline-none md:scroll-mt-20"
        >
            <Image
                src={hero.image.src}
                alt={hero.image.alt}
                fill
                preload
                sizes="100vw"
                className="object-cover object-center"
            />
            <div
                aria-hidden="true"
                className="absolute inset-0 bg-linear-to-t from-black/80 via-black/60 to-black/30"
            />
            {/* Fades the photo into pure black so the next section continues without a seam. */}
            <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black to-transparent md:h-40"
            />

            <div className="relative mx-auto w-full max-w-225 px-4 pt-[45svh] pb-16 text-center">
                <h1 id={TITLE_ID} className="font-display text-hero font-normal text-balance text-white">
                    {hero.title}
                </h1>
                <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-balance text-white/85 md:text-lg">
                    {hero.description}
                </p>
                <HeroActions />
            </div>
        </section>
    );
}
