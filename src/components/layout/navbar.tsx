import { ScrollLink } from "@/components/ui/scroll-link";
import { navigation } from "@/content/navigation";
import { cn, focusRing } from "@/lib/utils";
import { ActiveSectionObserver } from "./active-section-observer";
import { CloseMenuOnDesktop } from "./close-menu-on-desktop";

const MOBILE_MENU_ID = "mobile-menu";
const MENU_ITEM_STAGGER_MS = 40;
const SECTION_IDS = navigation.items.map((item) => item.id);

function BarRow({ inMenu = false }: { inMenu?: boolean }) {
    return (
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center px-4 md:h-20 md:px-8">
            <ScrollLink
                target={navigation.logo.target}
                aria-label={navigation.logo.ariaLabel}
                className={cn(
                    "inline-flex h-11 shrink-0 items-center rounded-sm text-sm font-semibold whitespace-nowrap text-white uppercase min-[360px]:text-base sm:text-lg sm:tracking-wide md:text-2xl md:tracking-wider",
                    focusRing,
                )}
            >
                {navigation.logo.label}
            </ScrollLink>

            {!inMenu && (
                <nav aria-label={navigation.menu.navLabel} className="ml-auto hidden lg:block">
                    <ul className="flex items-center gap-10">
                        {navigation.items.map((item) => (
                            <li key={item.id}>
                                <ScrollLink
                                    target={item.id}
                                    data-nav-item={item.id}
                                    className={cn(
                                        "relative rounded-sm text-sm font-medium tracking-[0.05em] text-white/85 uppercase transition-colors duration-200 hover:text-white aria-[current=true]:text-white",
                                        "after:absolute after:inset-x-0 after:-bottom-2 after:h-0.5 after:scale-x-0 after:bg-white after:transition-[scale] after:duration-300 after:ease-out-soft hover:after:scale-x-100 aria-[current=true]:after:scale-x-100 motion-reduce:after:transition-none",
                                        focusRing,
                                    )}
                                >
                                    {item.label}
                                </ScrollLink>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}

            <div className="ml-auto flex items-center gap-2 pl-3 sm:gap-3 lg:ml-10 lg:pl-0">
                <ScrollLink
                    target={navigation.cta.target}
                    className={cn(
                        "bg-accent relative rounded-full px-3 py-2 text-xs font-semibold tracking-[0.05em] whitespace-nowrap text-white uppercase after:absolute after:inset-x-0 after:-inset-y-1.5 sm:px-4 md:px-5 md:py-2.5 md:text-sm",
                        "hover:bg-accent-hover transition duration-200 hover:-translate-y-px active:scale-[0.97] motion-reduce:transition-none motion-reduce:hover:translate-y-0",
                        focusRing,
                    )}
                >
                    {navigation.cta.label}
                </ScrollLink>

                {inMenu ? (
                    <button
                        type="button"
                        aria-label={navigation.menu.closeLabel}
                        popoverTarget={MOBILE_MENU_ID}
                        popoverTargetAction="hide"
                        className={cn("relative -mr-2 size-11 shrink-0 rounded-sm lg:hidden", focusRing)}
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
                            "-mr-2 flex size-11 shrink-0 flex-col items-center justify-center gap-1.5 rounded-sm lg:hidden",
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
                    <ul className="flex flex-col items-center gap-4 pb-16 md:pb-20">
                        {navigation.items.map((item, index) => (
                            <li
                                key={item.id}
                                style={{ transitionDelay: `${index * MENU_ITEM_STAGGER_MS}ms` }}
                                className="transition duration-300 ease-out-soft motion-reduce:transition-none starting:translate-y-2 starting:opacity-0"
                            >
                                <ScrollLink
                                    target={item.id}
                                    data-nav-item={item.id}
                                    className={cn(
                                        "block rounded-sm px-4 py-2 text-2xl font-medium tracking-[0.05em] text-white/85 uppercase transition-colors hover:text-white aria-[current=true]:text-white",
                                        focusRing,
                                    )}
                                >
                                    {item.label}
                                </ScrollLink>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            <ActiveSectionObserver sectionIds={SECTION_IDS} />
            <CloseMenuOnDesktop menuId={MOBILE_MENU_ID} />
        </header>
    );
}
