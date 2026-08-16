import { Badge } from '@/components/ui/badge'
import { BadgeCheckIcon, CalendarDays, Clock8, Mail, MapPinHouse, MessageCircle, Phone } from 'lucide-react'
import { MAIL, OFFICE_CLOSING_TIME, OFFICE_START_TIIME, OFFICE_WEEK_DAYS, TELEPHONE } from '@/lib/contant'
import { getSiteSettings } from '@/lib/queries/settings'
import ContactForm from './contact-form'

export const metadata = {
  title: "Contact Us",
  description: "Get in touch with Gurgaon Elite Estate for property enquiries, site visits and expert real estate advice. Call, email or visit our Gurgaon office.",
}

const DEFAULT_MAP_EMBED_URL = "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3506.0702478452067!2d77.01455728!3d28.50753414!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1954f11df7c5%3A0x90e93daf0ec6634f!2sGURGAON%20ELITE%20ESTATE%20%3A%20Property%20Dealer%20Sector%20110%20Gurgaon!5e0!3m2!1sen!2sin!4v1782041501310!5m2!1sen!2sin"

const ContactUs = async () => {
  const settings = await getSiteSettings();
  const phone = settings.phone || TELEPHONE;
  const email = settings.email || MAIL;
  const officeHours = settings.officeHours || `${OFFICE_WEEK_DAYS} ${OFFICE_START_TIIME}-${OFFICE_CLOSING_TIME}`;
  const mapEmbedUrl = settings.mapEmbedUrl || DEFAULT_MAP_EMBED_URL;

  return (
    <main className="min-h-screen mt-18 max-w-7xl mx-auto py-8 flex flex-col lg:flex-row justify-between px-4">
      <aside className='h-full border lg:w-1/3 flex flex-col gap-6 p-4 rounded-2xl shadow-xl bg-muted'>
        <Badge variant="default">Contact Us</Badge>
        <h1 className='text-2xl md:text-4xl font-playfair'>Let's find your next home together.</h1>
        <p className='tracking-wider font-inter'>Whether you're buying, selling or just exploring the market, our team is ready to guide you with expert advice and personlized support.</p>
        <div className='flex flex-row items-center justify-start gap-2 border-2 border-r-yellow-500 border-l-yellow-500 p-4 rounded-xl bg-white dark:bg-black'>
          <div className='w-12 h-12 bg-yellow-500 rounded-lg flex flex-row justify-center items-center'>
            <Phone />
          </div>
          <div className='flex flex-col justify-center items-start gap-0'>
            <p className='font-playfair text-xl'>Call Us</p>
            <p className='text-xs tracking-wider'>{phone}</p>
          </div>
        </div>
        <div className='flex flex-row items-center justify-start gap-2 border-2 border-r-yellow-500 border-l-yellow-500 p-4 rounded-xl bg-white dark:bg-black'>
          <div className='w-12 h-12 bg-yellow-500 rounded-lg flex flex-row justify-center items-center'>
            <Mail />
          </div>
          <div className='flex flex-col justify-center items-start gap-0'>
            <p className='font-playfair text-xl'>Email</p>
            <p className='text-xs tracking-wider'>{email}</p>
          </div>
        </div>
        <div className='flex flex-col items-start justify-start gap-2 border-2 border-r-yellow-500 border-l-yellow-500 p-4 rounded-xl bg-white dark:bg-black'>
          <div className='flex flex-row justify-center items-start gap-2'>
            <MapPinHouse />
            <p className='font-playfair text-xl'>Visit Us</p>
          </div>
          {settings.officeAddress && (
            <p className='text-xs tracking-wider text-muted-foreground'>{settings.officeAddress}</p>
          )}
          <iframe src={mapEmbedUrl} loading="lazy" className='w-full h-52 rounded-xl'></iframe>
        </div>
        <div className='rounded-xl p-4 flex flex-row justify-between items-center bg-yellow-500/5 border border-yellow-500'>
          <div className='flex flex-col gap-2'>
            <p className='font-playfair text-xl text-yellow-500'>Office Hours</p>
            <p className='text-yellow-500'>{officeHours}</p>
          </div>
          <Clock8 />
        </div>
      </aside>
      <section className='lg:w-3/5 pt-8 lg:pt-0 flex flex-col justify-between p-4'>
        <div className='w-full h-full space-y-8'>
          <div className='flex flex-col gap-4'>
            <h2 className='text-3xl md:text-5xl font-playfair'>Send us a message</h2>
            <p className='text-sm tracking-wider text-muted-foreground'>Tell us what you're looking for and we'll get back to you shortly.</p>
          </div>
          <ContactForm />
        </div>
        <div className='w-full flex flex-col md:flex-row justify-between items-stretch gap-4'>
          <div className='border rounded-2xl shadow-xl flex flex-col w-full p-4 gap-4'>
            <h2 className='font-playfair text-2xl'>Why Choose Us</h2>
            <div className='p-4 shadow-md rounded-xl flex flex-row items-center justify-start gap-2 tracking-wider text-sm bg-white dark:bg-muted'>
              <BadgeCheckIcon size={16} color='#eab308' />
              <p>Dedicated Local Agents</p>
            </div>
            <div className='p-4 shadow-md rounded-xl flex flex-row items-center justify-start gap-2 tracking-wider text-sm bg-white dark:bg-muted'>
              <BadgeCheckIcon size={16} color='#eab308' />
              <p>Fast Response Times</p>
            </div>
          </div>
          <div className='border rounded-2xl shadow-xl flex flex-col w-full p-4 gap-4'>
            <h2 className='font-playfair text-2xl'>Need a quick answer?</h2>
            <div className='p-4 shadow-md rounded-xl flex flex-row items-center justify-start gap-2 tracking-wider text-sm bg-white dark:bg-muted'>
              <MessageCircle size={16} color='#eab308' />
              <p>Live Chat</p>
            </div>
            <div className='p-4 shadow-md rounded-xl flex flex-row items-center justify-start gap-2 tracking-wider text-sm bg-white dark:bg-muted'>
              <CalendarDays size={16} color='#eab308' />
              <p>Book a Consultation</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default ContactUs
