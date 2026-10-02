import { experienceDetailCopy } from "@/content/experiences";
import { EXPERIENCE_TITLE_ID } from "./experience-detail";
import { RetryButton } from "./retry-button";

type ExperienceDetailMessageProps = {
    variant: "notFound" | "error";
    headingLevel: "h1" | "h2";
};

export function ExperienceDetailMessage({ variant, headingLevel: Heading }: ExperienceDetailMessageProps) {
    const { error, notFound } = experienceDetailCopy.states;
    const copy = variant === "error" ? error : notFound;

    return (
        <div role={variant === "error" ? "alert" : undefined} className="px-8 py-16 text-center">
            <Heading id={EXPERIENCE_TITLE_ID} className="text-xl font-semibold tracking-wide text-white">
                {copy.title}
            </Heading>
            <p className="mt-3 text-sm leading-relaxed text-white/70 md:text-base">{copy.description}</p>
            {variant === "error" && <RetryButton label={error.retry} pendingLabel={error.retrying} />}
        </div>
    );
}
