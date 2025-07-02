import React from 'react'
import { assets } from '../assets/assets'
import { ArrowRight, CalendarIcon, ClockIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const HeroSection = () => {

  const navigate = useNavigate();

  return (

    <div className='flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 bg-[url("/bg-image.jpg")] bg-cover bg-center h-screen'>
      <img src={assets.marvelLogo} alt="" className='max-h-11 lg:h-11 mt-20'/>
      <h1 className='text-5xl md:text-[70px] md:leading-18 font-semibold max-w-110'>Moon <br />Knight</h1>
      <div className='flex items-center gap-4 text-blue-50'>
      <span>Action | Adventure | Sci-fi</span>
      <div className='flex items-center gap-1'>
        <CalendarIcon className='w-4.5 h-4.5'/> 2022
      </div>
      <div className='flex items-center gap-1'>
        <ClockIcon className='w-4.5 h-4.5'/> 2h 8m
      </div>
      </div>
      <p className='max-w-md text-gray-300'>Moon Knight is a gripping Marvel series about Marc Spector, a troubled man with dissociative identity disorder who becomes the avatar of the Egyptian moon god Khonshu. Blending psychological thriller, action, and mythology, it explores his battle between identities and a dark supernatural war.</p>
      <button onClick={()=>navigate("/movies")} className='flex items-center gap-1 px-6 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer'>
        Explore Movies
        <ArrowRight className='w-5 h-5'/>
      </button>
    </div>
  )
}

export default HeroSection
