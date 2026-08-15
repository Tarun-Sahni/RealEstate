import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { BRAND_NAME } from "@/lib/contant"

const CtaBanner = () => {
  return (
    <section className="px-4 pb-16">
      <div className="container mx-auto">
        <div className="relative overflow-hidden rounded-2xl bg-neutral-900 px-6 py-12 md:px-12 md:py-16">
          <svg
            className="pointer-events-none absolute inset-y-0 right-0 h-full w-full text-yellow-500 md:w-2/3"
            preserveAspectRatio="xMaxYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="cta-grid" width="42" height="42" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
                <rect width="20" height="20" x="2" y="2" rx="4" fill="currentColor" fillOpacity="0.12" />
              </pattern>
              <linearGradient id="cta-fade" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="white" stopOpacity="0" />
                <stop offset="65%" stopColor="white" stopOpacity="1" />
              </linearGradient>
              <mask id="cta-mask">
                <rect width="100%" height="100%" fill="url(#cta-fade)" />
              </mask>
            </defs>
            <rect width="100%" height="100%" fill="url(#cta-grid)" mask="url(#cta-mask)" />
          </svg>

          <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="flex max-w-xl flex-col gap-3">
              <h2 className="font-playfair text-3xl font-bold text-white md:text-4xl">
                Start Your Real Estate Journey Today
              </h2>
              <p className="text-sm leading-relaxed tracking-wide text-neutral-400 md:text-base">
                Your dream property is just a click away. Whether you&apos;re looking for a new home, a strategic investment, or expert real estate advice, {BRAND_NAME} is here to assist you every step of the way. Take the first step towards your real estate goals and explore our available properties or get in touch with our team for personalized assistance.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Link
                href="/properties"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-yellow-500 px-8 py-3 text-sm font-semibold text-black transition-colors hover:bg-yellow-400"
              >
                Explore Properties
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/contactus"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CtaBanner
