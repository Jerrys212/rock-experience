import Image from "next/image";

import type { Experience } from "@/content/experiences";

type ExperienceCardProps = {
    experience: Experience;
};

export function ExperienceCard({ experience }: ExperienceCardProps) {
    return (
        <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-white/8 bg-[#111113] transition-colors duration-500 hover:border-white/15 motion-reduce:transition-none">
            <div className="relative aspect-3/2">
                <div className="absolute inset-0 overflow-hidden">
                    <Image
                        src={experience.image}
                        alt={experience.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                    <div
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/60 to-transparent"
                    />
                </div>
                {/* Half over the photo, half over the card body. */}
                <span className="bg-accent absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 px-4.5 py-2 text-sm font-medium whitespace-nowrap text-white">
                    {experience.category}
                </span>
            </div>

            <div className="flex flex-1 flex-col px-8 pt-10.5 pb-8 text-center">
                <h3 className="text-xl font-semibold tracking-wide text-white">{experience.title}</h3>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/70 md:text-base">
                    {experience.description}
                </p>
            </div>
        </article>
    );
}
