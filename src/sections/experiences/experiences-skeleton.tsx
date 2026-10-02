import { experiencesSection } from "@/content/experiences";
import { gridClassName } from "./experiences-grid";

const PLACEHOLDER_COUNT = 6;
const pulse = "animate-pulse motion-reduce:animate-none";

export function ExperiencesSkeleton() {
    return (
        <div role="status">
            <span className="sr-only">{experiencesSection.states.loading}</span>
            <ul aria-hidden="true" className={gridClassName}>
                {Array.from({ length: PLACEHOLDER_COUNT }, (_, index) => (
                    <li key={index}>
                        <div className="flex h-full flex-col overflow-hidden rounded-lg border border-white/8 bg-surface">
                            <div className={`relative aspect-3/2 bg-white/5 ${pulse}`}>
                                <span className="absolute bottom-0 left-1/2 h-9 w-28 -translate-x-1/2 translate-y-1/2 bg-white/10" />
                            </div>
                            <div className="flex flex-1 flex-col items-center px-8 pt-10.5 pb-8">
                                <span className={`h-7 w-1/2 rounded bg-white/10 ${pulse}`} />
                                <span className={`mt-4 h-4 w-full rounded bg-white/5 ${pulse}`} />
                                <span className={`mt-2 h-4 w-4/5 rounded bg-white/5 ${pulse}`} />
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
