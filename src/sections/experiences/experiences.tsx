import { Suspense } from "react";
import { experiencesSection } from "@/content/experiences";
import { sectionIds } from "@/content/navigation";
import { ExperiencesGrid, type ExperiencesSearchParams } from "./experiences-grid";
import { ExperiencesSkeleton } from "./experiences-skeleton";

const TITLE_ID = "experiences-title";

type ExperiencesProps = {
    searchParams: ExperiencesSearchParams;
};

export function Experiences({ searchParams }: ExperiencesProps) {
    return (
        <section
            id={sectionIds.experiencias}
            aria-labelledby={TITLE_ID}
            tabIndex={-1}
            className="scroll-mt-16 bg-black py-20 focus:outline-none md:scroll-mt-20 md:py-30"
        >
            <div className="mx-auto max-w-7xl px-4 md:px-8">
                <div className="mb-12 flex items-center gap-6 md:mb-16">
                    <h2
                        id={TITLE_ID}
                        className="text-3xl font-bold tracking-wide text-white uppercase md:text-4xl"
                    >
                        {experiencesSection.title}
                    </h2>
                    <span aria-hidden="true" className="h-px flex-1 bg-white/15" />
                </div>

                <Suspense fallback={<ExperiencesSkeleton />}>
                    <ExperiencesGrid searchParams={searchParams} />
                </Suspense>
            </div>
        </section>
    );
}
