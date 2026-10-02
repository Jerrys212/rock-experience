"use client";

import type { ComponentProps } from "react";

type ScrollButtonProps = Omit<ComponentProps<"button">, "type" | "onClick"> & {
    target: string;
};

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
