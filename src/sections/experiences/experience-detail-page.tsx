import { Suspense } from "react";
import { ScrollLink } from "@/components/ui/scroll-link";
import { experienceDetailCopy } from "@/content/experiences";
import { sectionIds } from "@/content/navigation";
import { EXPERIENCE_TITLE_ID } from "./experience-detail";
import { ExperienceDetailLoader } from "./experience-detail-loader";
import { ExperienceDetailSkeleton } from "./experience-detail-skeleton";
import type { SearchParams } from "./simulation";

type ExperienceDetailPageProps = {
    params: Promise<{ id: string }>;
    searchParams: SearchParams;
};

export function ExperienceDetailPage({ params, searchParams }: ExperienceDetailPageProps) {
    return (
        <section aria-labelledby={EXPERIENCE_TITLE_ID} className="mx-auto max-w-3xl px-4 pt-24 pb-20 md:px-8 md:pt-32">
            <ScrollLink
                target={sectionIds.experiencias}
                className="inline-flex min-h-11 items-center rounded-sm text-sm font-medium tracking-[0.05em] text-white/85 uppercase transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
                <span aria-hidden="true">← </span>
                {experienceDetailCopy.back}
            </ScrollLink>
            <div className="bg-surface mt-3 overflow-hidden rounded-lg border border-white/8">
                <Suspense fallback={<ExperienceDetailSkeleton />}>
                    <ExperienceDetailLoader params={params} searchParams={searchParams} headingLevel="h1" />
                </Suspense>
            </div>
        </section>
    );
}
