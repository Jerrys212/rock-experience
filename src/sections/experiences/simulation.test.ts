import { afterEach, describe, expect, it, vi } from "vitest";
import { env } from "@/lib/env";
import { applySimulation } from "./simulation";

vi.mock("@/lib/env", () => ({ env: { NODE_ENV: "development" } }));

const params = (simular?: string) => Promise.resolve({ simular });

describe("applySimulation", () => {
    afterEach(() => {
        env.NODE_ENV = "development";
        vi.useRealTimers();
    });

    it("does nothing without the simular param", async () => {
        await expect(applySimulation(params())).resolves.toBeUndefined();
    });

    it("throws for simular=error", async () => {
        await expect(applySimulation(params("error"))).rejects.toThrow("Simulated failure");
    });

    it("waits before resolving for simular=carga", async () => {
        vi.useFakeTimers();
        let resolved = false;
        const pending = applySimulation(params("carga")).then(() => (resolved = true));

        await vi.advanceTimersByTimeAsync(3999);
        expect(resolved).toBe(false);
        await vi.advanceTimersByTimeAsync(1);
        await pending;
        expect(resolved).toBe(true);
    });

    it("is disabled outside development", async () => {
        env.NODE_ENV = "production";
        await expect(applySimulation(params("error"))).resolves.toBeUndefined();
    });
});
