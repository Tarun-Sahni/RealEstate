import React from 'react'
import HeroSection from './hero'
import PropertyCard from '@/components/user/common/propertcard'
import { FEATURED_PROPERTIES } from '@/lib/data/featuredproperties'

const Home = () => {
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
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 container mx-auto'>
            {FEATURED_PROPERTIES.map((property) => (
              <PropertyCard key={property.slug} {...property} />
            ))}
          </div>
        </section>
      </main>
    </>
  )
}

export default Home