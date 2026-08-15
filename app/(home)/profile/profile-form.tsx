"use client"

import { useMemo, useRef, useState } from "react"
import axios, { AxiosError } from "axios"
import { toast } from "sonner"
import { BadgeCheck, Camera, Eye, EyeClosed, Loader2, ShieldAlert } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useAuth } from "@/store/authStore"

interface ProfileUser {
  username: string
  email: string
  avatar: string
  role: string
  isVerified: boolean
  createdAt: string
}

const MAX_AVATAR_SIZE = 5 * 1024 * 1024 // 5MB

const getPasswordStrength = (password: string) => {
  if (!password) return { label: "", score: 0 }

  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 1) return { label: "Weak", score: 1 }
  if (score <= 3) return { label: "Medium", score: 2 }
  return { label: "Strong", score: 3 }
}

const ProfileForm = ({ user }: { user: ProfileUser }) => {
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const authState = useAuth((state: any) => state)

  const [username, setUsername] = useState(user.username)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState(user.avatar)
  const [savingProfile, setSavingProfile] = useState(false)

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  const profileDirty = username.trim() !== user.username || avatarFile !== null
  const strength = useMemo(() => getPasswordStrength(passwordForm.newPassword), [passwordForm.newPassword])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.")
      return
    }
    if (file.size > MAX_AVATAR_SIZE) {
      toast.error("Image must be smaller than 5MB.")
      return
    }

    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim().length < 3) {
      toast.error("Username must be at least 3 characters.")
      return
    }

    try {
      setSavingProfile(true)
      const formData = new FormData()
      formData.append("data", JSON.stringify({ username: username.trim() }))
      if (avatarFile) {
        formData.append("avatarFile", avatarFile)
      }

      const response = await axios.patch("/api/user/auth/profile", formData, { withCredentials: true })
      if (response?.data?.success) {
        toast.success(response.data.message)
        const updated = response.data.user
        setUsername(updated.username)
        setAvatarPreview(updated.avatar)
        setAvatarFile(null)
        authState.setAuth(updated.userId, updated.username, updated.email, updated.avatar, updated.role)
      }
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>
      const message = err.response?.data?.message || err.message || "Something went wrong"
      toast.error(message)
    } finally {
      setSavingProfile(false)
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordForm((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordForm.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.")
      return
    }
    if (passwordForm.newPassword === passwordForm.currentPassword) {
      toast.error("New password must be different from your current password.")
      return
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New password and confirm password must match.")
      return
    }

    try {
      setSavingPassword(true)
      const response = await axios.patch(
        "/api/user/auth/changepassword",
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
        { withCredentials: true }
      )
      if (response?.data?.success) {
        toast.success(response.data.message)
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
        setShowCurrentPassword(false)
        setShowNewPassword(false)
        setShowConfirmPassword(false)
      }
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>
      const message = err.response?.data?.message || err.message || "Something went wrong"
      toast.error(message)
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card className="overflow-hidden rounded-2xl">
        <CardHeader>
          <CardTitle className="font-inter text-lg font-medium">Profile Details</CardTitle>
          <CardDescription>Update your photo and username.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSubmit} className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="group relative"
                aria-label="Change avatar"
              >
                <Avatar size="lg" className="size-20 ring-2 ring-yellow-500/30">
                  <AvatarImage src={avatarPreview} alt={username} />
                  <AvatarFallback className="text-xl font-bold uppercase text-yellow-500">
                    {username[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <Camera size={18} />
                </span>
              </button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <div className="flex flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge variant="secondary" className="w-fit capitalize tracking-wider">
                    {user.role}
                  </Badge>
                  {user.isVerified ? (
                    <Badge className="w-fit gap-1 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400">
                      <BadgeCheck size={13} /> Verified
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="w-fit gap-1">
                      <ShieldAlert size={13} /> Unverified
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  Member since {new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                </span>
                <span className="text-xs text-muted-foreground">JPG or PNG, up to 5MB</span>
              </div>
            </div>

            <FieldGroup>
              <Field>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  maxLength={30}
                  required
                />
              </Field>
              <Field>
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user.email} disabled className="cursor-not-allowed opacity-70" />
              </Field>
            </FieldGroup>

            <Button
              type="submit"
              disabled={savingProfile || !profileDirty}
              className="w-fit self-end rounded-full bg-yellow-500 px-6 text-black hover:bg-yellow-400 disabled:bg-yellow-500/40"
            >
              {savingProfile ? (
                <>
                  <Loader2 className="animate-spin" /> Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="overflow-hidden rounded-2xl">
        <CardHeader>
          <CardTitle className="font-inter text-lg font-medium">Change Password</CardTitle>
          <CardDescription>Choose a strong password you don't use elsewhere.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
            <FieldGroup>
              <Field>
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-2.5 flex items-center text-muted-foreground hover:text-foreground"
                    aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                  >
                    {showCurrentPassword ? <Eye size={16} /> : <EyeClosed size={16} />}
                  </button>
                </div>
              </Field>
              <Field>
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    minLength={8}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-2.5 flex items-center text-muted-foreground hover:text-foreground"
                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                  >
                    {showNewPassword ? <Eye size={16} /> : <EyeClosed size={16} />}
                  </button>
                </div>
                {passwordForm.newPassword && (
                  <div className="flex flex-col gap-1.5 pt-1">
                    <div className="flex gap-1">
                      {[1, 2, 3].map((step) => (
                        <span
                          key={step}
                          className={cn(
                            "h-1 flex-1 rounded-full bg-muted transition-colors",
                            strength.score >= step &&
                              (strength.score === 1
                                ? "bg-red-500"
                                : strength.score === 2
                                  ? "bg-amber-500"
                                  : "bg-emerald-500")
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Password strength: <span className="font-medium">{strength.label}</span> · at least 8 characters
                    </span>
                  </div>
                )}
              </Field>
              <Field>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    minLength={8}
                    required
                    aria-invalid={passwordForm.confirmPassword.length > 0 && passwordForm.confirmPassword !== passwordForm.newPassword}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-2.5 flex items-center text-muted-foreground hover:text-foreground"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <Eye size={16} /> : <EyeClosed size={16} />}
                  </button>
                </div>
              </Field>
            </FieldGroup>

            <Button
              type="submit"
              disabled={savingPassword}
              className="w-fit self-end rounded-full bg-yellow-500 px-6 text-black hover:bg-yellow-400"
            >
              {savingPassword ? (
                <>
                  <Loader2 className="animate-spin" /> Updating...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProfileForm
