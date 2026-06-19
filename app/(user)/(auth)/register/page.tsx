"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Logo from '@/components/user/common/logo'
import { Eye, EyeClosed } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
  return (
    <main className="min-h-screen flex">
      <div className="relative lg:w-3/5 w-0">
        <Image
          src="/login.png"
          alt="login"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="flex flex-col items-center justify-center px-8 lg:w-2/5 w-full gap-8">
        <Logo
          width={120}
          height={120}
        />
        <div className='flex flex-col gap-4 items-center'>
          <h1 className='font-playfair text-5xl md:text-6xl font-medium text-center'>Create Account</h1>
          <p className='text-sm tracking-wider text-muted-foreground max-w-sm text-wrap text-center'>Join us to explore properties, save your favorite homes, and begin your real estate journey.</p>
        </div>
        <div className='grid gap-10 w-full max-w-md'>
          <div className='grid gap-4'>
            <Label htmlFor="username">Username</Label>
            <Input
              id='username'
              placeholder='Username'
              className="bg-slate-100 dark:bg-neutral-950 border-0 border-b border-b-gray-300 dark:border-b-gray-800 rounded-none shadow-none focus-visible:border-b-yellow-500 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <div className='grid gap-4'>
            <Label htmlFor="email">Email</Label>
            <Input
              id='email'
              placeholder='Email'
              type='email'
              className="bg-slate-100 dark:bg-neutral-950 border-0 border-b border-b-gray-300 dark:border-b-gray-800 rounded-none shadow-none focus-visible:border-b-yellow-500 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <div className='grid gap-4'>
            <Label htmlFor="password">Password</Label>
            <div className='relative'>
              <Input
                id='password'
                type={showPassword ? "text" : "password"}
                placeholder='**************'
                className="bg-slate-100 dark:bg-neutral-950 border-0 border-b border-b-gray-300 dark:border-b-gray-800 rounded-none shadow-none focus-visible:border-b-yellow-500 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button className='absolute bottom-0 right-0 cursor-pointer' variant="link" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ?
                  <Eye /> :
                  <EyeClosed />
                }
              </Button>
            </div>
          </div>
          <Button className='py-6 rounded-full bg-yellow-500 hover:bg-yellow-500/80 cursor-pointer'>
            Sign Up
          </Button>
          <p className='text-sm text-center text-gray-500'>Already have an account? <Link href="/login" className='text-black dark:text-white hover:underline'>Sign In</Link></p>
        </div>
      </div>
    </main>
  )
}

export default Register