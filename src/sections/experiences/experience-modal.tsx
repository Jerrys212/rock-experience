"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { EXPERIENCE_TITLE_ID } from "./experience-detail";

type ExperienceModalProps = {
    closeLabel: string;
    children: ReactNode;
};

export function ExperienceModal({ closeLabel, children }: ExperienceModalProps) {
    const router = useRouter();
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const opener = document.activeElement;
        const dialog = dialogRef.current;
        if (dialog && !dialog.open) dialog.showModal();
        return () => {
            dialog?.close();
            if (opener instanceof HTMLElement) opener.focus({ preventScroll: true });
        };
    }, []);

    const close = () => router.back();

    return (
        <dialog
            ref={dialogRef}
            aria-labelledby={EXPERIENCE_TITLE_ID}
            onCancel={(event) => {
                event.preventDefault();
                close();
            }}
            onClick={(event) => {
                if (event.target === event.currentTarget) close();
            }}
            className="bg-surface m-auto w-[calc(100%-2rem)] max-w-3xl overflow-hidden rounded-lg border border-white/8 p-0 text-white opacity-100 transition-opacity duration-200 backdrop:bg-black/80 backdrop:backdrop-blur-sm motion-reduce:transition-none starting:open:opacity-0"
        >
            <div className="max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain motion-safe:scroll-smooth">
                <button
                    type="button"
                    onClick={close}
                    aria-label={closeLabel}
                    className="absolute top-3 right-3 z-10 size-10 rounded-full bg-black/60 backdrop-blur-sm transition-colors hover:bg-black/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                    <span aria-hidden="true" className="absolute inset-x-2.5 top-1/2 h-0.5 rotate-45 bg-white" />
                    <span aria-hidden="true" className="absolute inset-x-2.5 top-1/2 h-0.5 -rotate-45 bg-white" />
                </button>
                {children}
            </div>
        </dialog>
    );
}
