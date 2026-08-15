import HeroSection from './hero'
import CtaBanner from './cta-banner'
import PropertyGrid from '@/components/user/property/property-grid'
import { getFeaturedProperties, getMostViewedProperties } from '@/lib/queries/properties'

const Home = async () => {
  const [featuredProperties, mostViewedProperties] = await Promise.all([
    getFeaturedProperties(8),
    getMostViewedProperties(8),
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
            <p className='max-w-md text-muted-foreground text-sm md:text-base'>
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
            <p className='max-w-md text-muted-foreground text-sm md:text-base'>
              The listings catching the most attention from buyers right now
            </p>
          </div>
          <div className='container mx-auto'>
            <PropertyGrid properties={mostViewedProperties} className='lg:grid-cols-4 xl:grid-cols-4' />
          </div>
        </section>
      </main>
    </>
  )
}

export default Home
