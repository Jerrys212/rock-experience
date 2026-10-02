"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

type RetryButtonProps = {
    label: string;
    pendingLabel: string;
};

/** Re-runs the server render so the section tries to load its data again. */
export function RetryButton({ label, pendingLabel }: RetryButtonProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    return (
        <button
            type="button"
            disabled={isPending}
            onClick={() => startTransition(() => router.refresh())}
            className="bg-accent hover:bg-accent-hover mt-8 inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-semibold tracking-[0.05em] text-white uppercase transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:opacity-60 motion-reduce:transition-none"
        >
            {isPending ? pendingLabel : label}
        </button>
    );
}
