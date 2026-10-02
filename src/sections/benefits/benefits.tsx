import { benefits, benefitsSection } from "@/content/benefits";
import { sectionIds } from "@/content/navigation";
import { BenefitCard } from "./benefit-card";

const TITLE_ID = "benefits-title";

export function Benefits() {
    return (
        <section
            id={sectionIds.beneficios}
            aria-labelledby={TITLE_ID}
            tabIndex={-1}
            className="scroll-mt-16 border-t border-white/8 bg-zinc-950 py-20 focus:outline-none md:scroll-mt-20 md:py-30"
        >
            <div className="mx-auto max-w-7xl px-4 md:px-8">
                <header className="mb-12 md:mb-16">
                    <div className="flex items-center gap-6">
                        <h2
                            id={TITLE_ID}
                            className="text-3xl font-bold tracking-wide text-white uppercase md:text-4xl"
                        >
                            {benefitsSection.title}
                        </h2>
                        <span aria-hidden="true" className="h-px flex-1 bg-white/15" />
                    </div>
                    <p className="mt-4 max-w-lg text-base leading-relaxed text-white/70 md:max-w-xl md:text-lg">
                        {benefitsSection.subtitle}
                    </p>
                </header>

                <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8 xl:grid-cols-4">
                    {benefits.map((benefit) => (
                        <li key={benefit.id}>
                            <BenefitCard benefit={benefit} />
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
