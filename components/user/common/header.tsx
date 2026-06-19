"use client"
import { Button } from '@/components/ui/button'
import Logo from './logo'
import { Menu, User, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import axios, { AxiosError } from 'axios'
import { useAuth } from '@/app/(user)/store/authStore'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Header = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [mobileNav, setMobileNav] = useState(false)
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState({
        userId: "",
        username: "",
        email: "",
        avatar: "",
        role: "",
    });
    const setAuth = useAuth((state: any) => state.setAuth);
    useEffect(() => {
        const handleScroll = () => { setScrolled(window.scrollY >= window.innerHeight * 0.2) };
        window.addEventListener("scroll", handleScroll);
        return () => { window.removeEventListener("scroll", handleScroll) };
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const response = await axios.get("/api/user/auth/getme", { withCredentials: true })
                if (response?.data?.success) {
                    const user = response.data.user;
                    if (user && user?.role === "USER") {
                        setUser({
                            userId: user?.userId,
                            username: user?.username,
                            email: user?.email,
                            avatar: user?.avatar,
                            role: user?.role
                        })
                        setAuth(
                            user?.userId,
                            user?.username,
                            user?.email,
                            user?.avatar,
                            user?.role
                        )
                    } else {
                        router.push("/admin")
                    }
                }
            } catch (error) {
                const err = error as AxiosError<any>;
                const message = err.response?.data?.message || err.message || "Something went wrong";
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, [setAuth])
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
                        <Link href="/about"
                            className={`px-4 py-1.5 transition-all tracking-widest text-sm hover:bg-yellow-500 hover:dark:text-black rounded-full ${scrolled ? "text-black dark:text-white" : "text-white"}`}>
                            About
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
                    {
                        loading ? (
                            <Skeleton className='h-10 w-24 rounded-full' />
                        ) : (user && user?.role === "USER" ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button className='flex flex-row gap-2 items-center justify-end cursor-pointer' variant="link">
                                        <Avatar>
                                            <AvatarImage
                                                src={user?.avatar}
                                                alt={user?.username}
                                            />
                                            <AvatarFallback className='uppercase'>{user?.username[0]}</AvatarFallback>
                                        </Avatar>
                                        <p className={`${scrolled ? "text-black dark:text-white" : "text-white"} capitalize tracking-wider`}>{user?.username}</p>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-40" align="end">
                                    <DropdownMenuGroup>
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuItem>
                                            Profile
                                            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            Billing
                                            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            Settings
                                            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem>Team</DropdownMenuItem>
                                        <DropdownMenuSub>
                                            <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
                                            <DropdownMenuPortal>
                                                <DropdownMenuSubContent>
                                                    <DropdownMenuItem>Email</DropdownMenuItem>
                                                    <DropdownMenuItem>Message</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem>More...</DropdownMenuItem>
                                                </DropdownMenuSubContent>
                                            </DropdownMenuPortal>
                                        </DropdownMenuSub>
                                        <DropdownMenuItem>
                                            New Team
                                            <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem>GitHub</DropdownMenuItem>
                                        <DropdownMenuItem>Support</DropdownMenuItem>
                                        <DropdownMenuItem disabled>API</DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem>
                                            Log out
                                            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link href="/login" className='flex justify-center items-center gap-2 bg-yellow-500 hover:bg-yellow-500/80 rounded-full px-6 py-2'>
                                <User color='#fff' size="16" />
                                <p className='hidden lg:block text-white tracking-widest font-inter text-sm'>Login</p>
                            </Link>
                        ))
                    }

                    <Button variant="link" onClick={() => setMobileNav(true)} className='block lg:hidden'>
                        <Menu size={16} color='white' />
                    </Button>
                </div>
            </header>
        </div>
    )
}

export default Header