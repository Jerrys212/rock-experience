import { ScrollLink } from "@/components/ui/scroll-link";
import { footer } from "@/content/footer";
import { navigation } from "@/content/navigation";
import { cn } from "@/lib/utils";

const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

export function Footer() {
    return (
        <footer className="border-t border-white/8 bg-black">
            <div className="mx-auto w-full max-w-7xl px-4 py-10 md:px-8 md:py-12">
                <div className="flex flex-col items-center gap-6 lg:flex-row lg:gap-10">
                    <ScrollLink
                        target={navigation.logo.target}
                        aria-label={navigation.logo.ariaLabel}
                        className={cn(
                            "inline-flex h-11 shrink-0 items-center rounded-sm text-lg font-semibold tracking-wide whitespace-nowrap text-white uppercase md:text-2xl md:tracking-wider",
                            focusRing,
                        )}
                    >
                        {navigation.logo.label}
                    </ScrollLink>

                    <nav aria-label={footer.navLabel} className="lg:ml-auto">
                        <ul className="grid grid-cols-2 justify-items-center gap-x-8 gap-y-1 sm:flex sm:flex-wrap sm:items-center sm:justify-center lg:gap-x-10">
                            {navigation.items.map((item) => (
                                <li key={item.id}>
                                    <ScrollLink
                                        target={item.id}
                                        className={cn(
                                            "inline-flex min-h-11 items-center rounded-sm text-sm font-medium tracking-[0.05em] text-white/85 uppercase transition-colors duration-200 hover:text-white",
                                            focusRing,
                                        )}
                                    >
                                        {item.label}
                                    </ScrollLink>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <ScrollLink
                        target={navigation.cta.target}
                        className={cn(
                            "bg-accent hover:bg-accent-hover inline-flex h-11 items-center rounded-full px-6 text-sm font-semibold tracking-[0.05em] whitespace-nowrap text-white uppercase transition duration-200 hover:-translate-y-px motion-reduce:transition-none motion-reduce:hover:translate-y-0",
                            focusRing,
                        )}
                    >
                        {navigation.cta.label}
                    </ScrollLink>
                </div>

                <p className="mt-8 border-t border-white/8 pt-6 text-center text-sm text-white/60 lg:text-left">
                    {footer.credit.prefix} <span className="font-medium text-white/85">{footer.credit.author}</span>
                </p>
            </div>
        </footer>
    );
}
