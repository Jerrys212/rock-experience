import { contact } from "@/content/contact";

export function ContactInfo() {
    const { title, description, details } = contact.info;

    return (
        <div>
            <h3 className="text-2xl font-semibold text-white">{title}</h3>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-white/70">{description}</p>

            <dl className="mt-7 flex flex-col">
                {details.map((detail) => (
                    <div key={detail.id} className="flex min-h-11 items-center gap-4">
                        <dt className="text-accent-light w-25 shrink-0 text-sm font-medium">{detail.label}</dt>
                        <dd className="min-w-0 text-white/75 wrap-anywhere">
                            {detail.href ? (
                                <a
                                    href={detail.href}
                                    className="inline-flex min-h-11 items-center rounded-sm underline-offset-4 transition-colors duration-150 hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                >
                                    {detail.value}
                                </a>
                            ) : (
                                detail.value
                            )}
                        </dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}
