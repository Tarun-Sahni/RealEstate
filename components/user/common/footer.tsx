import Logo from './logo'
import Link from 'next/link'
import { ArrowRight, Clock8, Mail, MapPin, Phone } from 'lucide-react'
import { BRAND_NAME, MAIL, TELEPHONE } from '@/lib/contant'
import { FaFacebook, FaInstagram, FaWhatsapp, FaYoutube } from 'react-icons/fa6'
import { getSiteSettings } from '@/lib/queries/settings'
import { NAVLINKS } from '@/lib/navlinks'

const Footer = async () => {
  const settings = await getSiteSettings();
  const phone = settings.phone || TELEPHONE;
  const supportEmail = settings.supportEmail || settings.email || MAIL;
  const facebookHref = settings.facebook || "https://facebook.com";
  const instagramHref = settings.instagram || "https://instagram.com";
  const youtubeHref = settings.youtube || "https://youtube.com";
  const whatsappHref = settings.whatsappNumber ? `https://wa.me/${settings.whatsappNumber}` : "https://wa.me/919999999999";

  return (
    <footer className='w-full bg-neutral-900 px-4'>
      <div className='max-w-7xl mx-auto grid grid-cols-1 gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4'>
        <div className='flex flex-col gap-5 sm:col-span-2 lg:col-span-2'>
          <Logo width={100} height={100} />
          <p className='max-w-sm text-sm leading-relaxed tracking-wide text-neutral-400'>
            Your trusted partner in finding exceptional properties. We bring expertise, integrity and personalized service to every step of your real estate journey.
          </p>
          <div className='flex items-center gap-4 pt-1'>
            <Link
              href={facebookHref}
              target="_blank"
              className="flex size-9 items-center justify-center rounded-full bg-white/5 text-white transition-colors hover:bg-[#1877F2] hover:text-white"
            >
              <FaFacebook className="size-4" />
            </Link>
            <Link
              href={instagramHref}
              target="_blank"
              className="flex size-9 items-center justify-center rounded-full bg-white/5 text-white transition-colors hover:bg-[#E4405F] hover:text-white"
            >
              <FaInstagram className="size-4" />
            </Link>
            <Link
              href={youtubeHref}
              target="_blank"
              className="flex size-9 items-center justify-center rounded-full bg-white/5 text-white transition-colors hover:bg-[#FF0000] hover:text-white"
            >
              <FaYoutube className="size-4" />
            </Link>
            <Link
              href={whatsappHref}
              target="_blank"
              className="flex size-9 items-center justify-center rounded-full bg-white/5 text-white transition-colors hover:bg-[#25D366] hover:text-white"
            >
              <FaWhatsapp className="size-4" />
            </Link>
          </div>
        </div>

        <div className='flex flex-col gap-4'>
          <h2 className='font-playfair text-lg tracking-wider text-white'>Quick Links</h2>
          <nav className='flex flex-col gap-3'>
            {NAVLINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className='flex items-center gap-2 text-sm tracking-wider text-neutral-300 transition-all hover:translate-x-1 hover:text-yellow-500'
              >
                <ArrowRight strokeWidth={2.75} size={14} className='text-yellow-500' />
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className='flex flex-col gap-4'>
          <h2 className='font-playfair text-lg tracking-wider text-white'>Contact Us</h2>
          <ul className='flex flex-col gap-3 text-sm text-neutral-300'>
            <li>
              <Link href={`tel: ${phone}`} className='flex items-start gap-2.5 tracking-wider transition-colors hover:text-yellow-500'>
                <Phone size={15} className='mt-0.5 shrink-0 text-yellow-500' />
                {phone}
              </Link>
            </li>
            <li>
              <Link href={`mailto: ${supportEmail}`} className='flex items-start gap-2.5 tracking-wider transition-colors hover:text-yellow-500'>
                <Mail size={15} className='mt-0.5 shrink-0 text-yellow-500' />
                {supportEmail}
              </Link>
            </li>
            {settings.officeAddress && (
              <li className='flex items-start gap-2.5 tracking-wider'>
                <MapPin size={15} className='mt-0.5 shrink-0 text-yellow-500' />
                {settings.officeAddress}
              </li>
            )}
            {settings.officeHours && (
              <li className='flex items-start gap-2.5 tracking-wider'>
                <Clock8 size={15} className='mt-0.5 shrink-0 text-yellow-500' />
                {settings.officeHours}
              </li>
            )}
          </ul>
        </div>
      </div>
      {/* copyright */}
      <div className='max-w-7xl mx-auto border-t border-t-white/10 py-6 text-center'>
        <p className='text-xs tracking-wider text-neutral-400 md:text-sm'>
          &copy;{new Date().getFullYear()} <span className='text-yellow-500'>{BRAND_NAME}</span> - All Rights Reserved
        </p>
      </div>
    </footer>
  )
}

export default Footer
