import Logo from './logo'
import Link from 'next/link'
import { ArrowRight, Dot } from 'lucide-react'
import { MAIL, TELEPHONE } from '@/lib/contant'
import { FaFacebook, FaInstagram, FaWhatsapp, FaYoutube } from 'react-icons/fa6'

const Footer = () => {
  return (
    <footer className='w-full bg-neutral-900 px-4'>
      <div className='max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 items-stretch pt-16 pb-8 gap-8'>
        <div className='flex flex-col gap-8'>
          <div className='max-w-sm'>
            <Logo width={100} height={100} />
            <p className='text-sm tracking-wider text-white'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis perferendis fugit veniam ad cumque labore suscipit distinctio non cupiditate nihil?</p>
          </div>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex flex-col justify-center items-start gap-1'>
              <h2 className='text-gray-500 text-xl font-playfair tracking-wider'>Customer Care</h2>
              <Link href={`tel: ${TELEPHONE}`} className='text-sm hover:underline tracking-wider text-white hover:text-yellow-600 hover:dark:text-yellow-500'>{TELEPHONE}</Link>
            </div>
            <div className='flex flex-col justify-center items-start gap-1'>
              <h2 className='text-gray-500 text-xl font-playfair tracking-wider'>Live Support</h2>
              <Link href={`mailto: ${MAIL}`} className='text-sm text-white hover:underline tracking-wider hover:text-yellow-600 hover:dark:text-yellow-500'>{MAIL}</Link>
            </div>
          </div>
          <div className='flex flex-col gap-4'>
            <h2 className='text-muted-foreground tracking-wider font-playfair text-xl'>Follow Us on Social Media</h2>
            <div className="flex items-center justify-start gap-5">
              <Link
                href="https://facebook.com"
                target="_blank"
                className="text-white hover:text-[#1877F2] dark:hover:text-[#1877F2] transition-colors"
              >
                <FaFacebook className="size-6" />
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                className="text-white hover:text-[#E4405F] dark:hover:text-[#E4405F] transition-colors"
              >
                <FaInstagram className="size-6" />
              </Link>
              <Link
                href="https://youtube.com"
                target="_blank"
                className="text-white hover:text-[#FF0000] dark:hover:text-[#FF0000] transition-colors"
              >
                <FaYoutube className="size-7" />
              </Link>
              <Link
                href="https://wa.me/919999999999"
                target="_blank"
                className="text-white hover:text-[#25D366] dark:hover:text-[#25D366] transition-colors"
              >
                <FaWhatsapp className="size-6" />
              </Link>
            </div>
          </div>
        </div>
        <div className='col-span-2 w-full flex flex-row justify-start lg:justify-end items-start gap-16 pt-8 flex-wrap'>
          <div className='flex flex-col gap-4'>
            <h2 className='text-muted-foreground text-xl tracking-wider font-playfair'>Quick Search</h2>
            <div className='flex flex-col gap-4'>
              <Link href="/" className='flex flex-row items-center gap-2 text-sm tracking-wider hover:translate-x-2 transition-all text-white'>
                <ArrowRight strokeWidth={2.75} size={16} color="#eab308" />
                Home
              </Link>
              <Link href="/" className='flex flex-row items-center gap-2 text-sm tracking-wider hover:translate-x-2 transition-all text-white'>
                <ArrowRight strokeWidth={2.75} size={16} color="#eab308" />
                Home
              </Link>
              <Link href="/" className='flex flex-row items-center gap-2 text-sm tracking-wider hover:translate-x-2 transition-all text-white'>
                <ArrowRight strokeWidth={2.75} size={16} color="#eab308" />
                Home
              </Link>
              <Link href="/" className='flex flex-row items-center gap-2 text-sm tracking-wider hover:translate-x-2 transition-all text-white'>
                <ArrowRight strokeWidth={2.75} size={16} color="#eab308" />
                Home
              </Link>
              <Link href="/" className='flex flex-row items-center gap-2 text-sm tracking-wider hover:translate-x-2 transition-all text-white'>
                <ArrowRight strokeWidth={2.75} size={16} color="#eab308" />
                Home
              </Link>
            </div>
          </div>
          <div className='flex flex-col gap-4'>
            <h2 className='text-muted-foreground text-xl tracking-wider font-playfair'>Quick Search</h2>
            <div className='flex flex-col gap-4'>
              <Link href="/" className='flex flex-row items-center gap-2 text-sm tracking-wider hover:translate-x-2 transition-all text-white'>
                <ArrowRight strokeWidth={2.75} size={16} color="#eab308" />
                Home
              </Link>
              <Link href="/" className='flex flex-row items-center gap-2 text-sm tracking-wider hover:translate-x-2 transition-all text-white'>
                <ArrowRight strokeWidth={2.75} size={16} color="#eab308" />
                Home
              </Link>
              <Link href="/" className='flex flex-row items-center gap-2 text-sm tracking-wider hover:translate-x-2 transition-all text-white'>
                <ArrowRight strokeWidth={2.75} size={16} color="#eab308" />
                Home
              </Link>
              <Link href="/" className='flex flex-row items-center gap-2 text-sm tracking-wider hover:translate-x-2 transition-all text-white'>
                <ArrowRight strokeWidth={2.75} size={16} color="#eab308" />
                Home
              </Link>
              <Link href="/" className='flex flex-row items-center gap-2 text-sm tracking-wider hover:translate-x-2 transition-all text-white'>
                <ArrowRight strokeWidth={2.75} size={16} color="#eab308" />
                Home
              </Link>
            </div>
          </div>
          <div className='flex flex-col gap-4'>
            <h2 className='text-muted-foreground text-xl tracking-wider font-playfair'>Quick Search</h2>
            <div className='flex flex-col gap-4'>
              <Link href="/" className='flex flex-row items-center gap-2 text-sm tracking-wider hover:translate-x-2 transition-all text-white'>
                <ArrowRight strokeWidth={2.75} size={16} color="#eab308" />
                Home
              </Link>
              <Link href="/" className='flex flex-row items-center gap-2 text-sm tracking-wider hover:translate-x-2 transition-all text-white'>
                <ArrowRight strokeWidth={2.75} size={16} color="#eab308" />
                Home
              </Link>
              <Link href="/" className='flex flex-row items-center gap-2 text-sm tracking-wider hover:translate-x-2 transition-all text-white'>
                <ArrowRight strokeWidth={2.75} size={16} color="#eab308" />
                Home
              </Link>
              <Link href="/" className='flex flex-row items-center gap-2 text-sm tracking-wider hover:translate-x-2 transition-all text-white'>
                <ArrowRight strokeWidth={2.75} size={16} color="#eab308" />
                Home
              </Link>
              <Link href="/" className='flex flex-row items-center gap-2 text-sm tracking-wider hover:translate-x-2 transition-all text-white'>
                <ArrowRight strokeWidth={2.75} size={16} color="#eab308" />
                Home
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* copyright */}
      <div className='max-w-6xl mx-auto justify-between items-center border-t border-t-gray-500/50 py-8 flex flex-col md:flex-row gap-1'>
        <p className='text-sm flex gap-1 text-wrap text-center md:text-left mx-auto md:m-0 tracking-wider text-white'>&copy;{new Date().getFullYear()} <span className='text-yellow-500'>Gurgaon Elite Estate</span> - All Rights Reserved</p>
        <div className='flex justify-center items-center gap-1'>
          <Link href="/" className='text-xs tracking-widest capitalize cursor-pointer hover:bg-gray-300 hover:dark:bg-black px-3 py-1 rounded-full text-white hover:text-black dark:text-white'>Privacy</Link>
          <Dot color='#eab308' />
          <Link href="/" className='text-xs tracking-widest capitalize cursor-pointer hover:bg-gray-300 hover:dark:bg-black px-3 py-1 rounded-full text-white hover:text-black dark:text-white'>Terms</Link>
          <Dot color='#eab308' />
          <Link href="/" className='text-xs tracking-widest capitalize cursor-pointer hover:bg-gray-300 hover:dark:bg-black px-3 py-1 rounded-full text-white hover:text-black dark:text-white'>Sitemap</Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer