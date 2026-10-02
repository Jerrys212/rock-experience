import { env } from "@/lib/env";

export type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const SIMULATED_DELAY_MS = 4000;

export async function applySimulation(searchParams: SearchParams): Promise<void> {
    if (env.NODE_ENV !== "development") return;
    const { simular } = await searchParams;
    if (simular === "carga") await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));
    if (simular === "error") throw new Error("Simulated failure (?simular=error)");
}
