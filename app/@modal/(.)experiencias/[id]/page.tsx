import { ExperienceDetailModal } from "@/sections/experiences/experience-detail-modal";

export default function ExperienceModalRoute({ params, searchParams }: PageProps<"/experiencias/[id]">) {
    return <ExperienceDetailModal params={params} searchParams={searchParams} />;
}
