"use client"
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Logo from '@/components/user/common/logo'
import axios, { AxiosError } from 'axios'
import { Eye, EyeClosed, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

const Login = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    identifier: "",
    password: "",
    rememberme: false
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true);
      const response = await axios.post("/api/user/auth/login", form, { withCredentials: true })
      if (response?.data?.success) {
        toast.success(response?.data?.message)
        router.push("/")
      }
    } catch (error) {
      const err = error as AxiosError<any>;
      const message = err.response?.data?.message || err.message || "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
      setForm({
        identifier: "",
        password: "",
        rememberme: false
      })
    }
  }
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
          <h1 className='font-playfair text-5xl md:text-6xl font-medium text-center'>Welcome Back</h1>
          <p className='text-sm tracking-wider text-muted-foreground max-w-sm text-wrap text-center'>Sign in to access your property listings, saved homes, and account dashboard.</p>
        </div>
        <form onSubmit={handleSubmit} className='grid gap-10 w-full max-w-md'>
          <div className='grid gap-4'>
            <Label htmlFor="identifier">Email</Label>
            <Input
              id='identifier'
              name="identifier"
              value={form?.identifier}
              onChange={handleChange}
              placeholder='Email or Username'
              className="bg-slate-100 dark:bg-neutral-950 border-0 border-b border-b-gray-300 dark:border-b-gray-800 rounded-none shadow-none focus-visible:border-b-yellow-500 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <div className='grid gap-4'>
            <div className='flex flex-row justify-between items-center'>
              <Label htmlFor="password">Password</Label>
              <Link href="/forgotpassword" className='text-sm underline hover:text-gray-500'>Forgot Password</Link>
            </div>
            <div className='relative'>
              <Input
                id='password'
                name="password"
                value={form?.password}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                placeholder='**************'
                className="bg-slate-100 dark:bg-neutral-950 border-0 border-b border-b-gray-300 dark:border-b-gray-800 rounded-none shadow-none focus-visible:border-b-yellow-500 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button type='button' className='absolute bottom-0 right-0 cursor-pointer' variant="link" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ?
                  <Eye /> :
                  <EyeClosed />
                }
              </Button>
            </div>
          </div>
          <div className='flex flex-row justify-start items-center gap-2'>
            <Checkbox
              id="rememberme"
              checked={form.rememberme}
              onCheckedChange={() => setForm({ ...form, rememberme: !form.rememberme })}
              className='border border-gray-500' />
            <Label htmlFor="rememberme">Remember Me for 7 Days</Label>
          </div>
          <Button className={`py-6 rounded-full bg-yellow-500 hover:bg-yellow-500/80 ${loading ? "cursor-not-allowed" : "cursor-pointer"}`} disabled={loading}>
            {
              loading ?
                <>
                  <Loader2 className='animate-spin' />
                  Submitting...
                </> :
                "Sign In"
            }
          </Button>
          <p className='text-sm text-center text-gray-500'>Don't have an account? <Link href="/register" className='text-black dark:text-white hover:underline'>Sign Up</Link></p>
        </form>
      </div>
    </main>
  )
}

export default Login