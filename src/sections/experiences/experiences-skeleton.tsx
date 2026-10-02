import { experiencesSection } from "@/content/experiences";

import { gridClassName } from "./experiences-grid";

const PLACEHOLDER_COUNT = 6;

/** Mirrors the card layout so the grid doesn't jump when the real cards arrive. */
export function ExperiencesSkeleton() {
    return (
        <div role="status">
            <span className="sr-only">{experiencesSection.states.loading}</span>
            <ul aria-hidden="true" className={gridClassName}>
                {Array.from({ length: PLACEHOLDER_COUNT }, (_, index) => (
                    <li key={index}>
                        <div className="flex h-full flex-col overflow-hidden rounded-lg border border-white/8 bg-[#111113]">
                            <div className="relative aspect-3/2 animate-pulse bg-white/5 motion-reduce:animate-none">
                                <span className="absolute bottom-0 left-1/2 h-9 w-28 -translate-x-1/2 translate-y-1/2 bg-white/10" />
                            </div>
                            <div className="flex flex-1 flex-col items-center px-8 pt-10.5 pb-8">
                                <span className="h-7 w-1/2 animate-pulse rounded bg-white/10 motion-reduce:animate-none" />
                                <span className="mt-4 h-4 w-full animate-pulse rounded bg-white/5 motion-reduce:animate-none" />
                                <span className="mt-2 h-4 w-4/5 animate-pulse rounded bg-white/5 motion-reduce:animate-none" />
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
