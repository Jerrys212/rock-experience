import { sectionIds, type SectionId } from "./navigation";

type HeroAction = { label: string; target: SectionId };

type HeroContent = {
    title: string;
    description: string;
    actions: { primary: HeroAction; secondary: HeroAction };
    image: { src: string; alt: string };
};

export const hero = {
    title: "Vive algo diferente.",
    description: "Descubre experiencias creadas para conectar marcas, tecnología y personas.",
    actions: {
        primary: { label: "Explorar experiencias", target: sectionIds.experiencias },
        secondary: { label: "Quiero participar", target: sectionIds.contacto },
    },
    image: {
        src: "/hero.avif",
        alt: "Escritorio con computadora, laptop y audífonos iluminado con luces de neón por la noche",
    },
} satisfies HeroContent;
