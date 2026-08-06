"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Logo from '@/components/user/common/logo'
import axios, { AxiosError } from 'axios'
import { Eye, EyeClosed, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

const AdminLogin = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: ""
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
      const response = await axios.post("/api/admin/auth", form, { withCredentials: true })
      if (response?.data?.success) {
        toast.success(response?.data?.message)
        router.push("/admin")
      }
    } catch (error) {
      const err = error as AxiosError<any>;
      const message = err.response?.data?.message || err.message || "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
      setForm({
        email: "",
        password: ""
      })
    }
  }

  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-8 px-8'>
      <Logo
        width={120}
        height={120}
      />
      <div className='flex flex-col gap-4 items-center'>
        <h1 className='font-playfair text-5xl md:text-6xl font-medium text-center'>Admin Login</h1>
        <p className='text-sm tracking-wider text-muted-foreground max-w-sm text-wrap text-center'>Sign in with your admin credentials to access the dashboard.</p>
      </div>
      <form onSubmit={handleSubmit} className='grid gap-10 w-full max-w-md'>
        <div className='grid gap-4'>
          <Label htmlFor="email">Email</Label>
          <Input
            id='email'
            name="email"
            type="email"
            value={form?.email}
            onChange={handleChange}
            placeholder='Email'
            className="bg-slate-100 dark:bg-neutral-950 border-0 border-b border-b-gray-300 dark:border-b-gray-800 rounded-none shadow-none focus-visible:border-b-yellow-500 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <div className='grid gap-4'>
          <Label htmlFor="password">Password</Label>
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
      </form>
    </div>
  )
}

export default AdminLogin
