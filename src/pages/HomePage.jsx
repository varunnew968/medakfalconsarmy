import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Identity from '../components/Identity'
import DistrictPride from '../components/DistrictPride'
import FalconFlock from '../components/FalconFlock'
import Gallery from '../components/Gallery'
import Footer from '../components/Footer'

function HomePage() {
  return (
    <div className="bg-midnight-black min-h-screen text-white overflow-x-hidden w-full relative">
      <Navbar />
      <Hero />
      <Identity />
      <DistrictPride />
      <FalconFlock />
      <Gallery />
      <Footer />
    </div>
  )
}

export default HomePage
