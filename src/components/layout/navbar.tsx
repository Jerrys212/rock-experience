import { ScrollButton } from "@/components/ui/scroll-button";
import { navigation } from "@/content/navigation";
import { cn } from "@/lib/utils";
import { ActiveSectionObserver } from "./active-section-observer";

const MOBILE_MENU_ID = "mobile-menu";
const SECTION_IDS = navigation.items.map((item) => item.id);

const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";
const closesMenu = { popoverTarget: MOBILE_MENU_ID, popoverTargetAction: "hide" } as const;

function BarRow({ inMenu = false }: { inMenu?: boolean }) {
    const menuProps = inMenu ? closesMenu : {};

    return (
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center px-4 md:h-20 md:px-8">
            <ScrollButton
                target={navigation.logo.target}
                aria-label={navigation.logo.ariaLabel}
                className={cn(
                    "rounded-sm text-lg font-semibold tracking-wide whitespace-nowrap text-white uppercase md:text-2xl md:tracking-wider",
                    focusRing,
                )}
                {...menuProps}
            >
                {navigation.logo.label}
            </ScrollButton>

            {!inMenu && (
                <nav aria-label={navigation.menu.navLabel} className="ml-auto hidden lg:block">
                    <ul className="flex items-center gap-10">
                        {navigation.items.map((item) => (
                            <li key={item.id}>
                                <ScrollButton
                                    target={item.id}
                                    data-nav-item={item.id}
                                    className={cn(
                                        "relative rounded-sm text-sm font-medium tracking-[0.05em] text-white/85 uppercase transition-colors duration-200 hover:text-white aria-[current=true]:text-white",
                                        "after:absolute after:inset-x-0 after:-bottom-2 after:h-0.5 after:bg-white after:opacity-0 after:transition-opacity after:duration-200 aria-[current=true]:after:opacity-100",
                                        focusRing,
                                    )}
                                >
                                    {item.label}
                                </ScrollButton>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}

            <div className="ml-auto flex items-center gap-3 lg:ml-10">
                <ScrollButton
                    target={navigation.cta.target}
                    className={cn(
                        "bg-accent rounded-full px-4 py-2 text-xs font-semibold tracking-[0.05em] text-white uppercase md:px-5 md:py-2.5 md:text-sm",
                        "hover:bg-accent-hover transition duration-200 hover:-translate-y-px motion-reduce:transition-none motion-reduce:hover:translate-y-0",
                        focusRing,
                    )}
                    {...menuProps}
                >
                    {navigation.cta.label}
                </ScrollButton>

                {inMenu ? (
                    <button
                        type="button"
                        aria-label={navigation.menu.closeLabel}
                        className={cn("relative -mr-2 size-10 rounded-sm lg:hidden", focusRing)}
                        {...closesMenu}
                    >
                        <span aria-hidden="true" className="absolute inset-x-2 top-1/2 h-0.5 rotate-45 bg-white" />
                        <span aria-hidden="true" className="absolute inset-x-2 top-1/2 h-0.5 -rotate-45 bg-white" />
                    </button>
                ) : (
                    <button
                        type="button"
                        popoverTarget={MOBILE_MENU_ID}
                        aria-controls={MOBILE_MENU_ID}
                        aria-label={navigation.menu.openLabel}
                        className={cn(
                            "-mr-2 flex size-10 flex-col items-center justify-center gap-1.5 rounded-sm lg:hidden",
                            focusRing,
                        )}
                    >
                        {[0, 1, 2].map((line) => (
                            <span key={line} aria-hidden="true" className="block h-0.5 w-6 bg-white" />
                        ))}
                    </button>
                )}
            </div>
        </div>
    );
}

export function Navbar() {
    return (
        <header className="fixed inset-x-0 top-0 z-50">
            <div aria-hidden="true" className="absolute inset-0 bg-black/40 backdrop-blur-md" />
            <div className="relative">
                <BarRow />
            </div>

            <div
                id={MOBILE_MENU_ID}
                popover="auto"
                className={cn(
                    "fixed inset-0 m-0 hidden h-dvh max-h-none w-full max-w-none flex-col border-0 bg-black/95 p-0 text-white backdrop-blur-md open:flex lg:open:hidden",
                    "opacity-100 transition-opacity duration-200 motion-reduce:transition-none starting:open:opacity-0",
                )}
            >
                <BarRow inMenu />
                <nav aria-label={navigation.menu.mobileNavLabel} className="flex flex-1 items-center justify-center">
                    <ul className="flex flex-col items-center gap-8 pb-16 md:pb-20">
                        {navigation.items.map((item) => (
                            <li key={item.id}>
                                <ScrollButton
                                    target={item.id}
                                    data-nav-item={item.id}
                                    className={cn(
                                        "rounded-sm text-2xl font-medium tracking-[0.05em] text-white/85 uppercase transition-colors hover:text-white aria-[current=true]:text-white",
                                        focusRing,
                                    )}
                                    {...closesMenu}
                                >
                                    {item.label}
                                </ScrollButton>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            <ActiveSectionObserver sectionIds={SECTION_IDS} />
        </header>
    );
}
