import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import DesignOne from "@/components/user/common/design1"
import { cn } from "@/lib/utils"
import { Quote, Star } from "lucide-react"
import type { PublicTestimonial } from "@/lib/queries/testimonials"

const Testimonials = ({ testimonials }: { testimonials: PublicTestimonial[] }) => {
  if (testimonials.length === 0) return null;

  return (
    <section className="px-4 py-16 md:py-24">
      <div className="container mx-auto flex flex-col gap-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <DesignOne />
          <h2 className="font-playfair text-3xl md:text-4xl font-bold">
            What Our Clients Say
          </h2>
          <p className="max-w-sm text-muted-foreground text-sm md:text-base">
            Real experiences from buyers, sellers and tenants we&apos;ve helped across Gurgaon
          </p>
        </div>

        <Carousel
          opts={{ align: "start", loop: testimonials.length > 3 }}
          className="w-full px-2 sm:px-6"
        >
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem
                key={testimonial._id}
                className="basis-full sm:basis-1/2 lg:basis-1/3"
              >
                <figure className="flex h-full flex-col gap-5 rounded-2xl border bg-card p-6 shadow-xs transition-shadow hover:shadow-md md:p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-yellow-500/50 bg-yellow-500/10">
                      <Quote size={20} className="text-yellow-500" fill="currentColor" strokeWidth={0} />
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <Star
                          key={value}
                          size={14}
                          className={cn(
                            value <= testimonial.rating
                              ? "fill-yellow-500 text-yellow-500"
                              : "fill-transparent text-muted-foreground/40"
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  <blockquote className="grow text-sm leading-relaxed tracking-wide text-muted-foreground md:text-[15px]">
                    &ldquo;{testimonial.message}&rdquo;
                  </blockquote>

                  <figcaption className="flex items-center gap-3 border-t pt-5">
                    <Avatar size="lg">
                      {testimonial.photo && <AvatarImage src={testimonial.photo} alt={testimonial.name} />}
                      <AvatarFallback className="font-playfair uppercase">
                        {testimonial.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-playfair text-base capitalize">{testimonial.name}</p>
                      <p className="text-xs tracking-wider text-yellow-500 uppercase font-semibold">
                        {testimonial.designation}
                      </p>
                    </div>
                  </figcaption>
                </figure>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>
    </section>
  )
}

export default Testimonials
