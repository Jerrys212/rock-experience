import Image from "next/image";
import { ScrollButton } from "@/components/ui/scroll-button";
import { experienceDetailCopy, type ExperienceDetail as ExperienceDetailData } from "@/content/experiences";

export const EXPERIENCE_TITLE_ID = "experience-title";

type ExperienceDetailProps = {
    experience: ExperienceDetailData;
    headingLevel: "h1" | "h2";
};

export function ExperienceDetail({ experience, headingLevel: Heading }: ExperienceDetailProps) {
    const { details } = experience;
    const facts = [
        { label: experienceDetailCopy.labels.format, value: details.format },
        { label: experienceDetailCopy.labels.duration, value: details.duration },
        { label: experienceDetailCopy.labels.capacity, value: details.capacity },
        { label: experienceDetailCopy.labels.location, value: details.location },
    ];

    return (
        <article>
            <div className="relative aspect-video">
                <div className="absolute inset-0 overflow-hidden">
                    <Image
                        src={experience.image}
                        alt={experience.title}
                        fill
                        sizes="(min-width: 800px) 768px, calc(100vw - 32px)"
                        className="object-cover"
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

            <div className="px-6 pt-10.5 pb-8 md:px-10 md:pb-10">
                <Heading
                    id={EXPERIENCE_TITLE_ID}
                    className="text-center text-2xl font-semibold tracking-wide text-balance text-white md:text-3xl"
                >
                    {experience.title}
                </Heading>
                <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-white/70 md:text-base">
                    {details.summary}
                </p>

                <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
                    {facts.map((fact) => (
                        <div key={fact.label} className="rounded-md border border-white/8 bg-white/3 px-4 py-3">
                            <dt className="text-xs font-medium tracking-[0.05em] text-white/60 uppercase">
                                {fact.label}
                            </dt>
                            <dd className="mt-1 text-sm font-medium text-white">{fact.value}</dd>
                        </div>
                    ))}
                </dl>

                <h3 className="mt-8 text-sm font-semibold tracking-[0.05em] text-white uppercase">
                    {experienceDetailCopy.highlightsTitle}
                </h3>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {details.highlights.map((highlight) => (
                        <li key={highlight} className="flex items-start gap-3 text-sm leading-relaxed text-white/80">
                            <span aria-hidden="true" className="bg-accent mt-2 size-1.5 shrink-0 rounded-full" />
                            {highlight}
                        </li>
                    ))}
                </ul>

                <div className="mt-10 flex justify-center">
                    <ScrollButton
                        target={experienceDetailCopy.cta.target}
                        className="bg-accent hover:bg-accent-hover inline-flex h-12 w-full items-center justify-center rounded-full px-8 text-sm font-semibold tracking-[0.05em] text-white uppercase transition duration-200 hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:w-auto"
                    >
                        {experienceDetailCopy.cta.label}
                    </ScrollButton>
                </div>
            </div>
        </article>
    );
}
