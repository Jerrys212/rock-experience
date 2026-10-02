import { useCallback } from "react";

import { prefersReducedMotion } from "@/lib/utils";

export function useScrollTo(): (id: string) => void {
    return useCallback((id: string) => {
        const target = document.getElementById(id);
        if (!target) return;

        target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
        target.focus({ preventScroll: true });
    }, []);
}
