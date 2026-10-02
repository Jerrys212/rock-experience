export const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

export function cn(...classes: Array<string | false | null | undefined>): string {
    return classes.filter(Boolean).join(" ");
}

export function prefersReducedMotion(): boolean {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
