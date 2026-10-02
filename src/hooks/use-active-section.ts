import { useEffect, useState } from "react";

export function useActiveSection(ids: readonly string[]): string | undefined {
    const [active, setActive] = useState<string | undefined>(ids[0]);
    const key = ids.join(",");

    useEffect(() => {
        const sections = key
            .split(",")
            .map((id) => document.getElementById(id))
            .filter((el): el is HTMLElement => el !== null);
        if (sections.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) setActive(entry.target.id);
                }
            },
            { rootMargin: "-50% 0px -50% 0px" },
        );

        sections.forEach((section) => observer.observe(section));
        return () => observer.disconnect();
    }, [key]);

    return active;
}
