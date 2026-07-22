import React from 'react'
import HeroSection from './hero'

const Home = () => {
  return (
    <>
      <main className='min-h-screen'>
        <HeroSection />
        <div className='min-h-96 px-4 flex flex-col gap-16 py-16'></div>
      </main>
    </>
  )
}

export default Home