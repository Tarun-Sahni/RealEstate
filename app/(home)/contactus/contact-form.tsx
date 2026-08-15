"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import axios, { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

const ContactForm = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    message: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isNaN(Number(form.phone)) || form.phone.length !== 10) {
        toast.error("Invalid Number")
      }
      const response = await axios.post("/api/user/contactus", form)
      if (response?.data?.success) {
        toast.success(response?.data?.message)
      }

    } catch (error) {
      const err = error as AxiosError<any>;
      const message = err.response?.data?.message || err.message || "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
      setForm({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        message: ""
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
      <div className='flex flex-col md:flex-row gap-4'>
        <div className='flex flex-col gap-3 w-full'>
          <Label>First Name</Label>
          <Input
            name="firstname"
            value={form.firstname}
            onChange={handleChange}
            placeholder='First Name'
            className='py-5 rounded bg-white dark:bg-muted'
          />
        </div>
        <div className='flex flex-col gap-3 w-full'>
          <Label>Last Name</Label>
          <Input
            name="lastname"
            value={form.lastname}
            onChange={handleChange}
            placeholder='Last Name'
            className='py-5 rounded bg-white dark:bg-muted'
          />
        </div>
      </div>
      <div className='flex flex-col gap-3 w-full'>
        <Label>Email</Label>
        <Input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder='Email'
          className='py-5 rounded bg-white dark:bg-muted'
        />
      </div>
      <div className='flex flex-col gap-3 w-full'>
        <Label>Phone Number</Label>
        <Input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder='Phone Number'
          className='py-5 rounded bg-white dark:bg-muted'
        />
      </div>
      <div className='flex flex-col gap-3 w-full'>
        <Label>How can we help?</Label>
        <Textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={6}
          placeholder='How can we help you?'
          className='py-5 rounded min-h-40 bg-white dark:bg-muted'
        />
      </div>
      <Button className='w-fit rounded-full py-2 px-5 tracking-wider cursor-pointer ml-auto' disabled={loading}>
        {loading ? <><Loader2 className='animate-spin' /> Submitting...</> : "Submit"}
      </Button>
    </form>
  )
}

export default ContactForm
