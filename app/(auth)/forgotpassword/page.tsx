"use client"
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Logo from '@/components/user/common/logo'
import axios, { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

const ForgotPassword = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    identifier: "",
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
      const response = await axios.post("/api/user/auth/forgotpassword", form, { withCredentials: true })
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
      })
    }
  }
  return (
    <div className="flex flex-col items-center justify-center px-8 lg:w-2/5 w-full gap-8">
      <Logo
        width={120}
        height={120}
      />
      <div className='flex flex-col gap-4 items-center'>
        <h1 className='font-playfair text-5xl md:text-6xl font-medium text-center'>Forgot Password</h1>
        <p className='text-sm tracking-wider text-muted-foreground max-w-sm text-wrap text-center'>Enter your email address or username and we'll send you a link to reset your password and regain access to your account.</p>
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
        <Button className={`py-6 rounded-full bg-yellow-500 hover:bg-yellow-500/80 ${loading ? "cursor-not-allowed" : "cursor-pointer"}`} disabled={loading}>
          {
            loading ?
              <>
                <Loader2 className='animate-spin' />
                Submitting...
              </> :
              "Submit"
          }
        </Button>
      </form>
    </div>
  )
}

export default ForgotPassword