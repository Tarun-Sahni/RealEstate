"use client"
import { Button } from '@/components/ui/button'
import Logo from './logo'
import { Menu, User, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const Header = () => {
    const [mobileNav, setMobileNav] = useState(false)
    return (
        <div className='w-full fixed z-50'>
            <header className='w-full container mx-auto border-b border-b-gray-500/20 h-18 flex items-center justify-between px-4'>
                <Logo />
                {mobileNav ? (
                    <div className='lg:hidden bg-white dark:bg-black absolute top-0 left-0 sm:w-sm w-full h-screen px-4'>
                        <div className='relative flex flex-col justify-start items-center'>
                            <Logo />
                            <div className='absolute top-6 right-0 cursor-pointer text-red-500'
                                onClick={() => setMobileNav(false)}>
                                <X />
                            </div>
                            <div className='w-full h-0.5 bg-gray-500/20 mb-4' />
                            <nav className='flex flex-col justify-start items-center gap-4'>
                                <Link href="/" className='text-white px-4 py-1.5 transition-all tracking-widest text-sm hover:bg-gray-500/50 rounded-full'>Home</Link>
                                <Link href="/" className='text-white px-4 py-1.5 transition-all tracking-widest text-sm hover:bg-gray-500/50 rounded-full'>About Us</Link>
                                <Link href="/" className='text-white px-4 py-1.5 transition-all tracking-widest text-sm hover:bg-gray-500/50 rounded-full'>Contact Us</Link>
                                <Link href="/" className='text-white px-4 py-1.5 transition-all tracking-widest text-sm hover:bg-gray-500/50 rounded-full'>Careers</Link>
                            </nav>
                        </div>
                    </div>
                ) : (
                    <nav className='hidden lg:flex flex-row justify-between items-center gap-1'>
                        <Link href="/" className='text-white px-4 py-1.5 transition-all tracking-widest text-sm hover:bg-gray-500/50 rounded-full'>Home</Link>
                        <Link href="/" className='text-white px-4 py-1.5 transition-all tracking-widest text-sm hover:bg-gray-500/50 rounded-full'>About Us</Link>
                        <Link href="/" className='text-white px-4 py-1.5 transition-all tracking-widest text-sm hover:bg-gray-500/50 rounded-full'>Contact Us</Link>
                        <Link href="/" className='text-white px-4 py-1.5 transition-all tracking-widest text-sm hover:bg-gray-500/50 rounded-full'>Careers</Link>
                    </nav>
                )}
                <div className='flex flex-row justify-center items-center gap-2'>
                    <Link href="/login" className='flex justify-center items-center gap-2 hover:bg-yellow-500 rounded-full px-4 py-1.5'>
                        <User color='white' size="16" />
                        <p className='hidden lg:block text-white tracking-widest font-inter text-sm'>Login</p>
                    </Link>
                    <Button variant="link" onClick={() => setMobileNav(true)} className='block lg:hidden'>
                        <Menu size={16} />
                    </Button>
                </div>
            </header>
        </div>
    )
}

export default Header