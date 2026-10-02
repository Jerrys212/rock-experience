import { Suspense } from "react";
import { SectionHeading } from "@/components/layout/section-heading";
import { experiencesSection } from "@/content/experiences";
import { sectionIds } from "@/content/navigation";
import { ExperiencesGrid } from "./experiences-grid";
import { ExperiencesSkeleton } from "./experiences-skeleton";
import type { SearchParams } from "./simulation";

const TITLE_ID = "experiences-title";

type ExperiencesProps = {
    searchParams: SearchParams;
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
                <SectionHeading id={TITLE_ID} title={experiencesSection.title} className="mb-12 md:mb-16" />

                <Suspense fallback={<ExperiencesSkeleton />}>
                    <ExperiencesGrid searchParams={searchParams} />
                </Suspense>
            </div>
        </section>
    );
}
