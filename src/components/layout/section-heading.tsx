import { cn } from "@/lib/utils";

type SectionHeadingProps = {
    id: string;
    title: string;
    className?: string;
};

export function SectionHeading({ id, title, className }: SectionHeadingProps) {
    return (
        <div className={cn("flex items-center gap-6", className)}>
            <h2 id={id} className="reveal text-3xl font-bold tracking-wide text-white uppercase md:text-4xl">
                {title}
            </h2>
            <span aria-hidden="true" className="reveal-line h-px flex-1 bg-white/15" />
        </div>
    );
}
