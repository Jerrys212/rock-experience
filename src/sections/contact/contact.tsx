import { SectionHeading } from "@/components/layout/section-heading";
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
                <SectionHeading id={TITLE_ID} title={contact.title} className="mb-12 md:mb-16" />

                <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
                    <div className="reveal lg:col-span-7">
                        <ContactForm />
                    </div>
                    <div className="reveal lg:col-span-5">
                        <ContactInfo />
                    </div>
                </div>
            </div>
        </section>
    );
}
