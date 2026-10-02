"use client";

import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";

type ScrollButtonProps = Omit<ComponentProps<"button">, "type" | "onClick"> & {
    target: string;
};

const HOME_SECTION_TIMEOUT_MS = 3000;

function scrollToSection(section: HTMLElement) {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    section.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    section.focus({ preventScroll: true });
}

function scrollWhenSectionRenders(target: string) {
    const startedAt = performance.now();
    const waitForSection = () => {
        const section = document.getElementById(target);
        if (section) scrollToSection(section);
        else if (performance.now() - startedAt < HOME_SECTION_TIMEOUT_MS) requestAnimationFrame(waitForSection);
    };
    requestAnimationFrame(waitForSection);
}

export function ScrollButton({ target, ...props }: ScrollButtonProps) {
    const router = useRouter();

    const handleClick = () => {
        const section = document.getElementById(target);
        if (section) {
            scrollToSection(section);
            return;
        }

        router.push("/", { scroll: false });
        scrollWhenSectionRenders(target);
    };

    return <button type="button" onClick={handleClick} {...props} />;
}
