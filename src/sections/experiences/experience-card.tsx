import Image from "next/image";
import Link from "next/link";
import type { Experience } from "@/content/experiences";

type ExperienceCardProps = {
    experience: Experience;
};

export function ExperienceCard({ experience }: ExperienceCardProps) {
    return (
        <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-white/8 bg-surface transition-colors duration-500 hover:border-white/15 has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-white motion-reduce:transition-none">
            <div className="relative aspect-3/2">
                <div className="absolute inset-0 overflow-hidden">
                    <Image
                        src={experience.image}
                        alt={experience.title}
                        fill
                        sizes="(min-width: 1280px) 384px, (min-width: 1024px) calc((100vw - 128px) / 3), (min-width: 768px) calc((100vw - 88px) / 2), (min-width: 640px) calc((100vw - 56px) / 2), calc(100vw - 32px)"
                        className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                    <div
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/60 to-transparent"
                    />
                </div>

                <span className="bg-accent absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 px-4.5 py-2 text-sm font-medium whitespace-nowrap text-white">
                    {experience.category}
                </span>
            </div>

            <div className="flex flex-1 flex-col px-8 pt-10.5 pb-8 text-center">
                <h3 className="text-xl font-semibold tracking-wide text-white">
                    <Link
                        href={`/experiencias/${experience.id}`}
                        scroll={false}
                        className="after:absolute after:inset-0 focus-visible:outline-none"
                    >
                        {experience.title}
                    </Link>
                </h3>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/70 md:text-base">
                    {experience.description}
                </p>
            </div>
        </article>
    );
}
