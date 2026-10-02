import { experiencesSection } from "@/content/experiences";
import { RetryButton } from "./retry-button";

export function ExperiencesError() {
    const { error } = experiencesSection.states;

    return (
        <div
            role="alert"
            className="mx-auto flex max-w-md flex-col items-center rounded-lg border border-white/8 bg-surface px-8 py-12 text-center"
        >
            <p className="text-xl font-semibold tracking-wide text-white">{error.title}</p>
            <p className="mt-3 text-sm leading-relaxed text-white/70 md:text-base">{error.description}</p>
            <RetryButton label={error.retry} pendingLabel={error.retrying} />
        </div>
    );
}
