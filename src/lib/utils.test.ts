import { afterEach, describe, expect, it, vi } from "vitest";
import { cn, prefersReducedMotion } from "./utils";

describe("cn", () => {
    it("joins truthy classes and skips falsy ones", () => {
        expect(cn("a", false, null, undefined, "", "b")).toBe("a b");
    });

    it("returns an empty string with no classes", () => {
        expect(cn()).toBe("");
    });
});

describe("prefersReducedMotion", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it.each([true, false])("returns %s from the media query", (matches) => {
        const matchMedia = vi.fn(() => ({ matches }));
        vi.stubGlobal("window", { matchMedia });

        expect(prefersReducedMotion()).toBe(matches);
        expect(matchMedia).toHaveBeenCalledWith("(prefers-reduced-motion: reduce)");
    });
});
