import DesignOne from "@/components/user/common/design1";
import { Award, CircleCheckBig, Handshake, Star, Users } from "lucide-react";
import Image from "next/image";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

const About = () => {
    return (
        <div className="min-h-screen mt-9 md:my-18 container mx-auto py-16 px-4 space-y-16 md:space-y-32">
            {/* Our Journey */}
            <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 justify-between items-center gap-8 lg:gap-4">
                <div className="flex flex-col lg:order-1 order-2 items-center lg:items-start">
                    <DesignOne />
                    <div className="flex flex-col gap-3 items-center lg:items-start">
                        <h1 className="text-4xl md:text-7xl font-playfair text-center lg:text-start">Our Journey</h1>
                        <p className="tracking-wider font-inter max-w-xl text-muted-foreground text-center lg:text-start text-sm md:text-base">Our story is one of continuous growth and evolution. We started as a small team with big dreams, determined to create a real estate platform that transcended the ordinary. Over the years, we've expanded our reach, forged valuable partnerships, and gained the trust of countless clients.</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-12">
                        <div className="flex flex-col justify-between items-center md:items-start gap-2 bg-white dark:bg-muted p-4 rounded-lg shadow">
                            <h2 className="font-playfair text-3xl md:text-4xl">200+</h2>
                            <p className="md:text-sm tracking-wider text-xs text-wrap text-center md:text-start">Happy Customers</p>
                        </div>
                        <div className="flex flex-col justify-between items-center md:items-start gap-2 bg-white dark:bg-muted p-4 rounded-lg shadow">
                            <h2 className="font-playfair text-3xl md:text-4xl">10k+</h2>
                            <p className="md:text-sm tracking-wider text-xs text-wrap text-center md:text-start">Properties for Clients</p>
                        </div>
                        <div className="flex flex-col justify-between items-center md:items-start gap-2 bg-white dark:bg-muted p-4 rounded-lg shadow">
                            <h2 className="font-playfair text-3xl md:text-4xl">10+</h2>
                            <p className="md:text-sm tracking-wider text-xs text-wrap text-center md:text-start">Years of Experience</p>
                        </div>
                    </div>
                </div>
                <div className='flex justify-center lg:justify-end items-center lg:order-2 roder-1'>
                    <Image
                        src="/aboutus.png"
                        alt='aboutus'
                        width={600}
                        height={600}
                        className="bg-[radial-gradient(#71717a_1px,transparent_1px)] bg-size-[16px_16px]"
                    />
                </div>
            </div>
            {/* Our Values */}
            <div className="container mx-auto flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-start gap-4 p-4">
                    <DesignOne />
                    <h1 className="text-4xl md:text-7xl font-playfair text-center lg:text-start">Our Values</h1>
                    <p className="tracking-wider font-inter max-w-xl text-muted-foreground text-center lg:text-start text-sm md:text-base">Our story is one of continuous growth and evolution. We started as a small team with big dreams, determined to create a real estate platform that transcended the ordinary.</p>
                </div>
                <div className="w-full border-8 rounded-lg grid grid-cols-1 md:grid-cols-2 p-2 md:p-8 border-neutral-200/50 dark:border-neutral-800">
                    <div className="flex flex-col gap-4 border-b p-6 lg:p-10">
                        <div className="flex flex-row gap-4 items-center justify-center lg:justify-start">
                            <div className="rounded-full border border-yellow-500/50 bg-yellow-500/10 w-12 h-12 flex justify-center items-center">
                                <Handshake size={24} color="#eab308" />
                            </div>
                            <h2 className="text-3xl font-bold font-playfair">Trust</h2>
                        </div>
                        <p className="tracking-wider font-inter max-w-xl text-muted-foreground text-center lg:text-start text-sm md:text-base">Trust is the cornerstone of every successful real estate transaction.</p>
                    </div>
                    <div className="flex flex-col gap-4 border-b p-6 lg:p-10 md:border-l">
                        <div className="flex flex-row gap-4 items-center justify-center lg:justify-start">
                            <div className="rounded-full border border-yellow-500/50 bg-yellow-500/10 w-12 h-12 flex justify-center items-center">
                                <Award size={24} color="#eab308" />
                            </div>
                            <h2 className="text-3xl font-bold font-playfair">Excellence</h2>
                        </div>
                        <p className="tracking-wider font-inter max-w-xl text-muted-foreground text-center lg:text-start text-sm md:text-base">Trust is the cornerstone of every successful real estate transaction.</p>
                    </div>
                    <div className="flex flex-col gap-4 p-6 lg:p-10 border-b md:border-b-0">
                        <div className="flex flex-row gap-4 items-center justify-center lg:justify-start">
                            <div className="rounded-full border border-yellow-500/50 bg-yellow-500/10 w-12 h-12 flex justify-center items-center">
                                <Users size={24} color="#eab308" />
                            </div>
                            <h2 className="text-3xl font-bold font-playfair">Client-Specific</h2>
                        </div>
                        <p className="tracking-wider font-inter max-w-xl text-muted-foreground text-center lg:text-start text-sm md:text-base">Trust is the cornerstone of every successful real estate transaction.</p>
                    </div>
                    <div className="flex flex-col gap-4 p-6 lg:p-10 md:border-l">
                        <div className="flex flex-row gap-4 items-center justify-center lg:justify-start">
                            <div className="rounded-full border border-yellow-500/50 bg-yellow-500/10 w-12 h-12 flex justify-center items-center">
                                <CircleCheckBig size={24} color="#eab308" />
                            </div>
                            <h2 className="text-3xl font-bold font-playfair">Our Commitment</h2>
                        </div>
                        <p className="tracking-wider font-inter max-w-xl text-muted-foreground text-center lg:text-start text-sm md:text-base">Trust is the cornerstone of every successful real estate transaction.</p>
                    </div>
                </div>
            </div>
            {/* Our Achievements */}
            <div className="mx-auto space-y-12 max-w-7xl">
                <div className="flex flex-col gap-3 items-center">
                    <DesignOne />
                    <h1 className="text-4xl md:text-7xl font-playfair text-center lg:text-start">Our Achievements</h1>
                    <p className="tracking-wider font-inter max-w-3xl text-muted-foreground text-center text-sm md:text-base">Our story is one of continuous growth and evolution. We started as a small team with big dreams, determined to create a real estate platform that transcended the ordinary.</p>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex flex-col items-center md:items-start gap-4 p-4 md:p-8 bg-linear-to-b from-neutral-500/10 to-transparent rounded-md">
                        <h2 className="font-playfair text-3xl">3+ Years of Excellence</h2>
                        <p className="tracking-wider text-muted-foreground text-sm md:text-base text-center md:text-left">Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut, vel molestias soluta eum minus tempora! Ratione, suscipit vel! Facilis, mollitia. Impedit, eveniet! Architecto, quaerat reprehenderit.</p>
                    </div>
                    <div className="flex flex-col items-center md:items-start gap-4 p-4 md:p-8 bg-linear-to-b from-neutral-500/10 to-transparent rounded-md">
                        <h2 className="font-playfair text-3xl">Happy Clients</h2>
                        <p className="tracking-wider text-muted-foreground text-sm md:text-base text-center md:text-left">Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut, vel molestias soluta eum minus tempora! Ratione, suscipit vel! Facilis, mollitia. Impedit, eveniet! Architecto, quaerat reprehenderit.</p>
                    </div>
                    <div className="flex flex-col items-center md:items-start gap-4 p-4 md:p-8 bg-linear-to-b from-neutral-500/10 to-transparent rounded-md">
                        <h2 className="font-playfair text-3xl">Industry Recognition</h2>
                        <p className="tracking-wider text-muted-foreground text-sm md:text-base text-center md:text-left">Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut, vel molestias soluta eum minus tempora! Ratione, suscipit vel! Facilis, mollitia. Impedit, eveniet! Architecto, quaerat reprehenderit.</p>
                    </div>
                </div>
            </div>
            {/* Our Team */}
            <div className="container mx-auto space-y-12">
                <div className="flex flex-col items-center">
                    <DesignOne />
                    <h1 className="text-4xl md:text-7xl font-playfair text-center lg:text-start">Meet Our Team</h1>
                    <p className="tracking-wider font-inter max-w-3xl text-muted-foreground text-center text-sm md:text-base">Our story is one of continuous growth and evolution. We started as a small team with big dreams, determined to create a real estate platform that transcended the ordinary.</p>
                </div>
                <Carousel className="w-full">
                    <CarouselContent>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <CarouselItem key={index} className="basis-1/2 lg:basis-1/4">
                                <div className="w-full border p-4 rounded-md space-y-4">
                                    <Image
                                    src="/placeholder.svg"
                                    alt="image"
                                    width={500}
                                    height={500}
                                    className="rounded-md"
                                    />
                                    <p className="px-2 text-center">John Doe</p>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
        </div>
    );
};

export default About;
