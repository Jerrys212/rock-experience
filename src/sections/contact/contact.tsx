import { contact } from "@/content/contact";
import { sectionIds } from "@/content/navigation";
import { ContactForm } from "./contact-form";
import { ContactInfo } from "./contact-info";

const TITLE_ID = "contact-title";

export function Contact() {
    return (
        <section
            id={sectionIds.contacto}
            aria-labelledby={TITLE_ID}
            tabIndex={-1}
            className="scroll-mt-16 border-t border-white/8 bg-black py-20 focus:outline-none md:scroll-mt-20 md:py-30"
        >
            <div className="mx-auto max-w-7xl px-4 md:px-8">
                <div className="mb-12 flex items-center gap-6 md:mb-16">
                    <h2
                        id={TITLE_ID}
                        className="text-3xl font-bold tracking-wide text-white uppercase md:text-4xl"
                    >
                        {contact.title}
                    </h2>
                    <span aria-hidden="true" className="h-px flex-1 bg-white/15" />
                </div>

                <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
                    <div className="lg:col-span-7">
                        <ContactForm />
                    </div>
                    <div className="lg:col-span-5">
                        <ContactInfo />
                    </div>
                </div>
            </div>
        </section>
    );
}
