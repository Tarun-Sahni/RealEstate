"use client"
import { Button } from '@/components/ui/button'
import Logo from './logo'
import { Menu, User, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import axios, { AxiosError } from 'axios'
import { useAuth } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from 'sonner'
import { ThemeToggle } from '../../theme/themetoggle'

export const NAVLINKS = [
    {
        name: "Home",
        href: "/",
    },
    {
        name: "About Us",
        href: "/aboutus",
    },
    {
        name: "Contact Us",
        href: "/contactus",
    },
    {
        name: "Properties",
        href: "/",
    }
]

const Header = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [mobileNav, setMobileNav] = useState(false)
    const [user, setUser] = useState({
        userId: "",
        username: "",
        email: "",
        avatar: "",
        role: "",
    });
    const setAuth = useAuth((state: any) => state.setAuth);

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

    const logOut = async () => {
        try {
            const response = await axios.post("/api/user/auth/logout", { withCredentials: true })
            if (response.data.success) {
                setUser({
                    userId: "",
                    username: "",
                    email: "",
                    avatar: "",
                    role: "",
                });
                toast.success(response.data.message);
                router.refresh();
            }
        } catch (error) {
            const err = error as AxiosError<any>;
            const message = err.response?.data?.message || err.message || "Something went wrong";
            toast.error(message);
        }
    }
    return (
        <div className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300 bg-white dark:bg-black shadow-md">
            <header className='w-full container mx-auto h-16 flex items-center justify-between px-4 '>
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
                                {NAVLINKS.map((link) => (
                                    <Button asChild variant="link" key={link.href}>
                                        <Link href={link.href}>
                                            {link.name}
                                        </Link>
                                    </Button>
                                ))}
                            </nav>
                        </div>
                    </div>
                ) : (
                    <nav className='hidden lg:flex flex-row justify-between items-center gap-1'>
                        {NAVLINKS.map((link,index) => (
                            <Button key={index} asChild variant="link">
                                <Link href={link.href}>
                                    {link.name}
                                </Link>
                            </Button>
                        ))}
                    </nav>
                )}
                <div className='flex flex-row justify-center items-center gap-0'>
                    <ThemeToggle />
                    {
                        loading ? (
                            <Skeleton className='h-10 w-24 rounded-full' />
                        ) : (user && user?.role === "USER" ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button className='flex flex-row gap-2 items-center justify-end cursor-pointer hover:bg-transparent dark:hover:bg-transparent' variant="ghost">
                                        <Avatar>
                                            <AvatarImage
                                                src={user?.avatar}
                                                alt={user?.username}
                                            />
                                            <AvatarFallback className='uppercase font-bold text-lg text-yellow-500 shadow-xl'>{user?.username[0]}</AvatarFallback>
                                        </Avatar>
                                        <p className="capitalize tracking-wider">{user?.username}</p>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-40" align="center">
                                    <DropdownMenuGroup>
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => router.push("/profile")}>
                                            Profile
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            Settings
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem onClick={() => logOut()}>
                                            Log out
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link href="/login" className='flex justify-center items-center gap-2 hover:bg-yellow-500 transition-all rounded-full px-6 py-2'>
                                <User size="16" />
                                <p className='hidden lg:block tracking-widest font-inter text-sm'>Login</p>
                            </Link>
                        ))
                    }
                    <Button variant="link" onClick={() => setMobileNav(true)} className='block lg:hidden'>
                        <Menu size={16} />
                    </Button>
                </div>
            </header>
        </div>
    )
}

export default Header