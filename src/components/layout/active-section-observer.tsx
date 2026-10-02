"use client";

import { useEffect } from "react";

type ActiveSectionObserverProps = {
    sectionIds: readonly string[];
};

export function ActiveSectionObserver({ sectionIds }: ActiveSectionObserverProps) {
    const key = sectionIds.join(",");

    useEffect(() => {
        const sections = key
            .split(",")
            .map((id) => document.getElementById(id))
            .filter((el): el is HTMLElement => el !== null);
        if (sections.length === 0) return;

        const markActive = (id: string) => {
            document.querySelectorAll<HTMLElement>("[data-nav-item]").forEach((item) => {
                if (item.dataset.navItem === id) item.setAttribute("aria-current", "true");
                else item.removeAttribute("aria-current");
            });
        };

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) markActive(entry.target.id);
                }
            },
            { rootMargin: "-50% 0px -50% 0px" },
        );

        sections.forEach((section) => observer.observe(section));
        return () => observer.disconnect();
    }, [key]);

    return null;
}
