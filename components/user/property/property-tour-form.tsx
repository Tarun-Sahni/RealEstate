"use client"

import { useState } from "react"
import axios, { AxiosError } from "axios"
import { toast } from "sonner"
import { CalendarClock, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

interface PropertyTourFormProps {
  propertyId: string
  propertyTitle: string
}

const initialForm = { fullName: "", email: "", phone: "", message: "" }

type FieldErrors = Partial<Record<"fullName" | "email" | "phone", string>>

// Letters and spaces only, e.g. "Anne Sharma" - keystrokes outside this are dropped as they're typed.
const NAME_CHARS_REGEX = /[^a-zA-Z\s]/g
// Letters, numbers, whitespace and a small set of everyday punctuation - blocks symbols like <>{}@#$%^&*.
const MESSAGE_CHARS_REGEX = /[^a-zA-Z0-9\s.,!?'"()-]/g
// Digits only - blocks letters and symbols like abcd, +, -, ().
const PHONE_CHARS_REGEX = /[^0-9]/g
// Valid email character set - blocks spaces and symbols that can never appear in an email.
const EMAIL_CHARS_REGEX = /[^a-zA-Z0-9@._%+-]/g

const NAME_REGEX = /^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/
const PHONE_REGEX = /^\d{10}$/

const validate = (form: typeof initialForm): FieldErrors => {
  const errors: FieldErrors = {}

  const fullName = form.fullName.trim()
  if (!fullName) errors.fullName = "Full name is required."
  else if (fullName.length < 3) errors.fullName = "Full name must be at least 3 characters."
  else if (!NAME_REGEX.test(fullName)) errors.fullName = "Full name can only contain letters and spaces."

  const email = form.email.trim()
  if (!email) errors.email = "Email is required."
  else if (!EMAIL_REGEX.test(email)) errors.email = "Enter a valid email address."

  const phone = form.phone.trim()
  if (!phone) errors.phone = "Phone number is required."
  else if (!PHONE_REGEX.test(phone)) errors.phone = "Enter a valid 10-digit phone number."

  return errors
}

const PropertyTourForm = ({ propertyId, propertyTitle }: PropertyTourFormProps) => {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [loading, setLoading] = useState(false)

  const clearError = (field: keyof FieldErrors) => {
    setErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, fullName: e.target.value.replace(NAME_CHARS_REGEX, "") }))
    clearError("fullName")
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, phone: e.target.value.replace(PHONE_CHARS_REGEX, "").slice(0, 10) }))
    clearError("phone")
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, email: e.target.value.replace(EMAIL_CHARS_REGEX, "") }))
    clearError("email")
  }

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, message: e.target.value.replace(MESSAGE_CHARS_REGEX, "") }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationErrors = validate(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      toast.error("Please fix the highlighted fields.")
      return
    }

    try {
      setLoading(true)
      const response = await axios.post("/api/user/visitbooking", {
        propertyId,
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        message: form.message.trim(),
      })
      if (response?.data?.success) {
        toast.success(response.data.message)
        setForm(initialForm)
        setErrors({})
      }
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>
      const message = err.response?.data?.message || err.message || "Something went wrong"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 ring-1 ring-foreground/10 sm:p-6">
      <div className="flex items-center gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-yellow-500/10">
          <CalendarClock size={20} className="text-yellow-500" />
        </div>
        <div className="flex flex-col">
          <h2 className="font-playfair text-xl font-semibold">Get a Tour of This Property</h2>
          <p className="text-sm text-muted-foreground">
            Share your details and our team will schedule a visit for {propertyTitle}.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="tour-fullname">Full Name *</Label>
            <Input
              id="tour-fullname"
              name="fullName"
              value={form.fullName}
              onChange={handleNameChange}
              placeholder="Your full name"
              aria-invalid={!!errors.fullName}
              className="rounded bg-white py-5 dark:bg-muted"
            />
            {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="tour-phone">Phone Number *</Label>
            <Input
              id="tour-phone"
              name="phone"
              inputMode="numeric"
              maxLength={10}
              value={form.phone}
              onChange={handlePhoneChange}
              placeholder="10-digit phone number"
              aria-invalid={!!errors.phone}
              className="rounded bg-white py-5 dark:bg-muted"
            />
            {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="tour-email">Email *</Label>
          <Input
            id="tour-email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleEmailChange}
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            className="rounded bg-white py-5 dark:bg-muted"
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="tour-message">Message</Label>
          <Textarea
            id="tour-message"
            name="message"
            value={form.message}
            onChange={handleMessageChange}
            rows={4}
            placeholder="Preferred date/time or anything else we should know (optional)"
            className="min-h-28 rounded bg-white dark:bg-muted"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full self-end rounded-full bg-yellow-500 px-6 py-2.5 text-black hover:bg-yellow-400 sm:w-fit"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" /> Submitting...
            </>
          ) : (
            "Request a Tour"
          )}
        </Button>
      </form>
    </div>
  )
}

export default PropertyTourForm
