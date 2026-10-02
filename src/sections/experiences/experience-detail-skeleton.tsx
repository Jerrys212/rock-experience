import { experienceDetailCopy } from "@/content/experiences";

const pulse = "animate-pulse motion-reduce:animate-none";

export function ExperienceDetailSkeleton() {
    return (
        <div role="status">
            <span className="sr-only">{experienceDetailCopy.states.loading}</span>
            <div aria-hidden="true">
                <div className={`relative aspect-video bg-white/5 ${pulse}`}>
                    <span className="absolute bottom-0 left-1/2 h-9 w-28 -translate-x-1/2 translate-y-1/2 bg-white/10" />
                </div>
                <div className="flex flex-col items-center px-6 pt-10.5 pb-8 md:px-10 md:pb-10">
                    <span className={`h-8 w-1/2 rounded bg-white/10 ${pulse}`} />
                    <span className={`mt-5 h-4 w-full max-w-2xl rounded bg-white/5 ${pulse}`} />
                    <span className={`mt-2 h-4 w-4/5 max-w-xl rounded bg-white/5 ${pulse}`} />
                    <div className="mt-8 grid w-full grid-cols-2 gap-3 md:grid-cols-4">
                        {Array.from({ length: 4 }, (_, index) => (
                            <span key={index} className={`h-16 rounded-md bg-white/5 ${pulse}`} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
