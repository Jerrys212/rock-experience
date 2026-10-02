import type { Benefit } from "@/content/benefits";

type BenefitCardProps = {
    benefit: Benefit;
};

export function BenefitCard({ benefit }: BenefitCardProps) {
    const Icon = benefit.icon;

    return (
        <article className="group bg-surface flex h-full flex-col items-center rounded-lg border border-white/8 px-6 py-8 text-center transition duration-300 hover:-translate-y-1 hover:border-accent/40 motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:px-7 md:py-10">
            <div className="border-accent/60 bg-accent/10 group-hover:bg-accent/20 flex size-18 shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors duration-300 motion-reduce:transition-none">
                <Icon aria-hidden="true" size={30} strokeWidth={1.5} className="text-accent-light" />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-white">{benefit.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/70 md:text-base">{benefit.description}</p>
        </article>
    );
}
