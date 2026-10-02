import { Experiences } from "@/sections/experiences/experiences";
import { Hero } from "@/sections/hero/hero";

export default function Home({ searchParams }: PageProps<"/">) {
    return (
        <>
            <Hero />
            <Experiences searchParams={searchParams} />
        </>
    );
}
