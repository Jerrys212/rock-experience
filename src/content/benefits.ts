import { Radio, Sparkles, TrendingUp, Users, type LucideIcon } from "lucide-react";

export type Benefit = {
    id: string;
    icon: LucideIcon;
    title: string;
    description: string;
};

export const benefitsSection = {
    title: "Beneficios",
    subtitle:
        "Diseñamos experiencias que no solo se ven bien: conectan con las personas, se recuerdan y generan resultados para tu marca.",
};

export const benefits = [
    {
        id: "nuevas-audiencias",
        icon: Users,
        title: "Nuevas audiencias",
        description:
            "Conecta tu marca con comunidades de gaming, música y creadores que ya están buscando algo nuevo.",
    },
    {
        id: "tecnologia-que-sorprende",
        icon: Sparkles,
        title: "Tecnología que sorprende",
        description:
            "Inteligencia artificial y activaciones interactivas que convierten a tu marca en algo que se recuerda.",
    },
    {
        id: "resultados-medibles",
        icon: TrendingUp,
        title: "Resultados medibles",
        description:
            "Cada experiencia genera leads, datos y métricas claras para que sepas exactamente qué funcionó.",
    },
    {
        id: "presencial-y-digital",
        icon: Radio,
        title: "Presencial y digital",
        description:
            "Activaciones en vivo y en línea conectadas en tiempo real para llegar a más personas, estén donde estén.",
    },
] satisfies Benefit[];
