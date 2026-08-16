import HeroSection from './hero'
import CtaBanner from './cta-banner'
import PropertyGrid from '@/components/user/property/property-grid'
import Testimonials from '@/components/user/home/testimonials'
import { getFeaturedProperties, getMostViewedProperties } from '@/lib/queries/properties'
import { getTestimonials } from '@/lib/queries/testimonials'

export const metadata = {
  title: "Buy, Sell & Rent Properties in Gurgaon",
  description: "Browse featured and most-viewed apartments, villas, plots and commercial properties in Gurgaon. Verified listings, transparent pricing and expert guidance from Gurgaon Elite Estate.",
}

// Always render fresh from the database — admin-managed content (properties, testimonials)
// should never be served from a stale build-time cache.
export const dynamic = "force-dynamic"

const Home = async () => {
  const [featuredProperties, mostViewedProperties, testimonials] = await Promise.all([
    getFeaturedProperties(8),
    getMostViewedProperties(8),
    getTestimonials(9),
  ])

  return (
    <>
      <main className='min-h-screen'>
        <HeroSection />
        <section className='px-4 py-16 flex flex-col gap-10'>
          <div className='flex flex-col items-center gap-2 text-center'>
            <h2 className='font-playfair text-3xl md:text-4xl font-bold'>
              Featured Properties
            </h2>
            <p className='max-w-sm text-muted-foreground text-sm md:text-base'>
              Handpicked listings curated for their location, value and design
            </p>
          </div>
          <div className='container mx-auto'>
            <PropertyGrid properties={featuredProperties} className='lg:grid-cols-4 xl:grid-cols-4' />
          </div>
        </section>
        <CtaBanner />
        <section className='px-4 py-16 flex flex-col gap-10'>
          <div className='flex flex-col items-center gap-2 text-center'>
            <h2 className='font-playfair text-3xl md:text-4xl font-bold'>
              Most Viewed Properties
            </h2>
            <p className='max-w-xs text-muted-foreground text-sm md:text-base'>
              The listings catching the most attention from buyers right now
            </p>
          </div>
          <div className='container mx-auto'>
            <PropertyGrid properties={mostViewedProperties} className='lg:grid-cols-4 xl:grid-cols-4' />
          </div>
        </section>
        <Testimonials testimonials={testimonials} />
      </main>
    </>
  )
}

export default Home
