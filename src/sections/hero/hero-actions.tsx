import { ScrollLink } from "@/components/ui/scroll-link";
import { hero } from "@/content/hero";
import { cn } from "@/lib/utils";

const base =
    "inline-flex h-12 w-full items-center justify-center rounded-full px-7 text-sm font-semibold tracking-[0.05em] uppercase transition duration-200 hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:w-auto";

export function HeroActions() {
    const { primary, secondary } = hero.actions;

    return (
        <div className="mx-auto mt-10 flex max-w-xs flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4">
            <ScrollLink target={primary.target} className={cn(base, "bg-accent hover:bg-accent-hover text-white")}>
                {primary.label}
            </ScrollLink>
            <ScrollLink
                target={secondary.target}
                className={cn(base, "border border-white/60 text-white hover:border-white hover:bg-white/10")}
            >
                {secondary.label}
            </ScrollLink>
        </div>
    );
}
