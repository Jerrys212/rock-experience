import { Suspense } from "react";
import { experienceDetailCopy } from "@/content/experiences";
import { ExperienceDetailLoader } from "./experience-detail-loader";
import { ExperienceDetailSkeleton } from "./experience-detail-skeleton";
import { ExperienceModal } from "./experience-modal";
import type { SearchParams } from "./simulation";

type ExperienceDetailModalProps = {
    params: Promise<{ id: string }>;
    searchParams: SearchParams;
};

export function ExperienceDetailModal({ params, searchParams }: ExperienceDetailModalProps) {
    return (
        <ExperienceModal closeLabel={experienceDetailCopy.close}>
            <Suspense fallback={<ExperienceDetailSkeleton />}>
                <ExperienceDetailLoader params={params} searchParams={searchParams} headingLevel="h2" />
            </Suspense>
        </ExperienceModal>
    );
}
