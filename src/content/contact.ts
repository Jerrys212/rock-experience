import type { ContactField } from "@/actions/contact/schema";

type TextField = {
    label: string;
    placeholder: string;
    optional?: boolean;
};

type ContactDetail = {
    id: string;
    label: string;
    value: string;
    href?: string;
};

type ContactContent = {
    title: string;
    form: {
        fields: Record<Exclude<ContactField, "privacy" | "website">, TextField>;
        optionalLabel: string;
        honeypotLabel: string;
        privacy: {
            before: string;
            linkLabel: string;
            after: string;
            newTabNotice: string;
        };
        submit: { label: string; loadingLabel: string };
        generalError: string;
    };
    success: { message: string; resetLabel: string };
    info: {
        title: string;
        description: string;
        details: ContactDetail[];
    };
};

export const contact = {
    title: "Quiero participar",
    form: {
        fields: {
            name: { label: "Nombre", placeholder: "Tu nombre completo" },
            email: { label: "Correo electrónico", placeholder: "nombre@empresa.com" },
            phone: { label: "Teléfono", placeholder: "55 1234 5678" },
            company: { label: "Empresa", placeholder: "Nombre de tu empresa o proyecto", optional: true },
            message: { label: "Mensaje", placeholder: "Cuéntanos qué tienes en mente" },
        },
        optionalLabel: "(opcional)",
        honeypotLabel: "Sitio web",
        privacy: {
            before: "He leído y acepto el ",
            linkLabel: "aviso de privacidad",
            after: ".",
            newTabNotice: "(se abre en una pestaña nueva)",
        },
        submit: { label: "Enviar datos", loadingLabel: "Enviando…" },
        generalError: "No pudimos enviar tus datos. Inténtalo de nuevo en unos minutos.",
    },
    success: {
        message: "Gracias. Recibimos tus datos correctamente.",
        resetLabel: "Enviar otra respuesta",
    },
    info: {
        title: "Hablemos",
        description:
            "¿Tienes una marca, un proyecto o una comunidad? Cuéntanos qué tienes en mente y diseñamos una experiencia a tu medida.",
        details: [
            { id: "email", label: "Correo", value: "hola@rockexperience.mx", href: "mailto:hola@rockexperience.mx" },
            { id: "phone", label: "Teléfono", value: "+52 55 0000 0000", href: "tel:+525500000000" },
            { id: "location", label: "Ubicación", value: "Ciudad de México" },
        ],
    },
} satisfies ContactContent;
