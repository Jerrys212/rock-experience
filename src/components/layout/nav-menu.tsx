"use client";

import { useEffect, useRef, useState } from "react";

import { navigation } from "@/content/navigation";
import { useActiveSection } from "@/hooks/use-active-section";
import { useScrollTo } from "@/hooks/use-scroll-to";
import { cn } from "@/lib/utils";

const MOBILE_MENU_ID = "mobile-menu";
const SECTION_IDS = navigation.items.map((item) => item.id);
const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

export function NavMenu() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const scrollTo = useScrollTo();
  const active = useActiveSection(SECTION_IDS);

  useEffect(() => {
    if (!open) return;

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    // The menu only exists below lg; close it if the viewport grows past that.
    const desktop = window.matchMedia("(min-width: 64rem)");
    const onResize = () => desktop.matches && setOpen(false);

    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onResize);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onResize);
    };
  }, [open]);

  const navigate = (id: string) => {
    if (!open) {
      scrollTo(id);
      return;
    }
    // Wait for the body scroll lock to be released before scrolling.
    setOpen(false);
    requestAnimationFrame(() => scrollTo(id));
  };

  return (
    <>
      <div className="mx-auto flex h-16 max-w-7xl items-center px-4 md:h-20 md:px-8">
        <button
          type="button"
          onClick={() => navigate(navigation.logo.target)}
          aria-label={navigation.logo.ariaLabel}
          className={cn(
            "rounded-sm text-lg font-semibold tracking-wide whitespace-nowrap text-white uppercase md:text-2xl md:tracking-wider",
            focusRing,
          )}
        >
          {navigation.logo.label}
        </button>

        <nav aria-label={navigation.menu.navLabel} className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-10">
            {navigation.items.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => navigate(item.id)}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "relative rounded-sm text-sm font-medium tracking-[0.05em] uppercase transition-colors duration-200",
                      "after:absolute after:inset-x-0 after:-bottom-2 after:h-0.5 after:bg-white after:transition-opacity after:duration-200",
                      isActive
                        ? "text-white after:opacity-100"
                        : "text-white/85 after:opacity-0 hover:text-white",
                      focusRing,
                    )}
                  >
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-3 lg:ml-10">
          <button
            type="button"
            onClick={() => navigate(navigation.cta.target)}
            className={cn(
              "bg-accent rounded-full px-4 py-2 text-xs font-semibold tracking-[0.05em] text-white uppercase md:px-5 md:py-2.5 md:text-sm",
              "hover:bg-accent-hover transition duration-200 hover:-translate-y-px motion-reduce:transition-none motion-reduce:hover:translate-y-0",
              focusRing,
            )}
          >
            {navigation.cta.label}
          </button>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls={MOBILE_MENU_ID}
            aria-label={open ? navigation.menu.closeLabel : navigation.menu.openLabel}
            className={cn(
              "-mr-2 flex size-10 flex-col items-center justify-center gap-1.5 rounded-sm lg:hidden",
              focusRing,
            )}
          >
            {[
              open ? "translate-y-2 rotate-45" : "",
              open ? "opacity-0" : "",
              open ? "-translate-y-2 -rotate-45" : "",
            ].map((state, index) => (
              <span
                key={index}
                aria-hidden="true"
                className={cn(
                  "block h-0.5 w-6 bg-white transition duration-200 motion-reduce:transition-none",
                  state,
                )}
              />
            ))}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id={MOBILE_MENU_ID}
          aria-label={navigation.menu.mobileNavLabel}
          className="animate-fade-in fixed inset-0 -z-10 flex items-center justify-center bg-black/95 backdrop-blur-md motion-reduce:animate-none lg:hidden"
        >
          <ul className="flex flex-col items-center gap-8">
            {navigation.items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => navigate(item.id)}
                  aria-current={active === item.id ? "true" : undefined}
                  className={cn(
                    "rounded-sm text-2xl font-medium tracking-[0.05em] uppercase transition-colors",
                    active === item.id ? "text-white" : "text-white/85 hover:text-white",
                    focusRing,
                  )}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
}
