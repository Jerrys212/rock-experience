"use client";

import type { ComponentProps } from "react";

type ScrollButtonProps = Omit<ComponentProps<"button">, "type" | "onClick"> & {
    /** Id of the section to scroll to. It needs `tabIndex={-1}` to receive focus. */
    target: string;
};

/**
 * Scrolls to a section without touching the URL (no hash), then moves focus to it
 * so keyboard and screen reader users land in the right place.
 */
export function ScrollButton({ target, ...props }: ScrollButtonProps) {
    const handleClick = () => {
        const section = document.getElementById(target);
        if (!section) return;

        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        section.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
        section.focus({ preventScroll: true });
    };

    return <button type="button" onClick={handleClick} {...props} />;
}
