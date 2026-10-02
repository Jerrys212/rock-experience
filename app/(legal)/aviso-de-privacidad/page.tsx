import type { Metadata } from "next";
import Link from "next/link";
import { privacy } from "@/content/privacy";
import { site } from "@/lib/site";

export const metadata: Metadata = {
    title: `${privacy.title} | ${site.name}`,
    description: privacy.description,
};

export default function PrivacyPage() {
    return (
        <article className="mx-auto max-w-3xl px-4 pt-32 pb-20 md:px-8 md:pt-40 md:pb-30">
            <h1 className="text-3xl font-bold tracking-wide text-white uppercase md:text-4xl">{privacy.title}</h1>
            <p className="mt-6 text-base leading-relaxed text-white/70">{privacy.body}</p>
            <Link
                href="/"
                className="mt-10 inline-block rounded-sm text-sm text-white/70 underline underline-offset-4 transition-colors duration-150 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
                {privacy.backLabel}
            </Link>
        </article>
    );
}
