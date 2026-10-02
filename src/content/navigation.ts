export const sectionIds = {
    inicio: "inicio",
    experiencias: "experiencias",
    beneficios: "beneficios",
    contacto: "contacto",
} as const;

export type SectionId = (typeof sectionIds)[keyof typeof sectionIds];

export type NavItem = {
    id: SectionId;
    label: string;
};

type Navigation = {
    logo: { label: string; ariaLabel: string; target: SectionId };
    items: NavItem[];
    cta: { label: string; target: SectionId };
    menu: { openLabel: string; closeLabel: string; navLabel: string; mobileNavLabel: string };
};

export const navigation = {
    logo: {
        label: "Rock Experience",
        ariaLabel: "Rock Experience, ir al inicio",
        target: "inicio",
    },
    items: [
        { id: "inicio", label: "Inicio" },
        { id: "experiencias", label: "Experiencias" },
        { id: "beneficios", label: "Beneficios" },
        { id: "contacto", label: "Contacto" },
    ],
    cta: { label: "Participar", target: "contacto" },
    menu: {
        openLabel: "Abrir menú",
        closeLabel: "Cerrar menú",
        navLabel: "Principal",
        mobileNavLabel: "Menú principal",
    },
} satisfies Navigation;
