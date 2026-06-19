"use client"
import { Button } from '@/components/ui/button'
import Logo from './logo'
import { Menu, User, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const Header = () => {
    const [mobileNav, setMobileNav] = useState(false)
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => { setScrolled(window.scrollY >= window.innerHeight * 0.2) };
        window.addEventListener("scroll", handleScroll);
        return () => { window.removeEventListener("scroll", handleScroll) };
    }, []);
    return (
        <div className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${scrolled
            ? "bg-white dark:bg-black shadow-md"
            : "bg-transparent"
            }`}>
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
                                <Link href="/"
                                    className="px-4 py-1.5 transition-all tracking-widest text-sm hover:bg-yellow-500 rounded-full">
                                    Home
                                </Link>

                            </nav>
                        </div>
                    </div>
                ) : (
                    <nav className='hidden lg:flex flex-row justify-between items-center gap-1'>
                        <Link href="/"
                            className={`px-4 py-1.5 transition-all tracking-widest text-sm hover:bg-yellow-500 hover:dark:text-black rounded-full ${scrolled ? "text-black dark:text-white" : "text-white"}`}>
                            Home
                        </Link>
                        <Link href="/"
                            className={`px-4 py-1.5 transition-all tracking-widest text-sm hover:bg-yellow-500 hover:dark:text-black rounded-full ${scrolled ? "text-black dark:text-white" : "text-white"}`}>
                            Home
                        </Link>
                        <Link href="/"
                            className={`px-4 py-1.5 transition-all tracking-widest text-sm hover:bg-yellow-500 hover:dark:text-black rounded-full ${scrolled ? "text-black dark:text-white" : "text-white"}`}>
                            Home
                        </Link>
                        <Link href="/"
                            className={`px-4 py-1.5 transition-all tracking-widest text-sm hover:bg-yellow-500 hover:dark:text-black rounded-full ${scrolled ? "text-black dark:text-white" : "text-white"}`}>
                            Home
                        </Link>
                        <Link href="/"
                            className={`px-4 py-1.5 transition-all tracking-widest text-sm hover:bg-yellow-500 hover:dark:text-black rounded-full ${scrolled ? "text-black dark:text-white" : "text-white"}`}>
                            Home
                        </Link>
                    </nav>
                )}
                <div className='flex flex-row justify-center items-center gap-1'>
                    <Link href="/login" className='flex justify-center items-center gap-2 bg-yellow-500 hover:bg-yellow-500/80 rounded-full px-6 py-2'>
                        <User color='#000' size="16" />
                        <p className='hidden lg:block text-black tracking-widest font-inter text-sm'>Login</p>
                    </Link>
                    <Button variant="link" onClick={() => setMobileNav(true)} className='block lg:hidden'>
                        <Menu size={16} color='white' />
                    </Button>
                </div>
            </header>
        </div>
    )
}

export default Header