"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";

type ScrollLinkProps = Omit<ComponentProps<typeof Link>, "href" | "onClick"> & {
    target: string;
};

const SECTION_WAIT_TIMEOUT_MS = 3000;

function scrollToSection(section: HTMLElement) {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    section.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    section.focus({ preventScroll: true });
}

// An open modal locks body scroll, so wait for it to close before scrolling.
function scrollWhenSectionIsReachable(target: string) {
    const startedAt = performance.now();
    const waitForSection = () => {
        const section = document.getElementById(target);
        if (section && !document.querySelector("dialog:modal")) scrollToSection(section);
        else if (performance.now() - startedAt < SECTION_WAIT_TIMEOUT_MS) requestAnimationFrame(waitForSection);
    };
    requestAnimationFrame(waitForSection);
}

const isModifiedClick = (event: MouseEvent) =>
    event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

export function ScrollLink({ target, ...props }: ScrollLinkProps) {
    const router = useRouter();

    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
        if (isModifiedClick(event)) return;
        event.preventDefault();

        const link = event.currentTarget;
        link.closest<HTMLElement>("[popover]")?.hidePopover();

        const insideModal = link.closest("dialog") !== null;
        const section = document.getElementById(target);
        if (section && !insideModal) {
            scrollToSection(section);
            return;
        }

        if (insideModal) router.back();
        else router.push("/", { scroll: false });
        scrollWhenSectionIsReachable(target);
    };

    return <Link href={`/#${target}`} scroll={false} onClick={handleClick} {...props} />;
}
