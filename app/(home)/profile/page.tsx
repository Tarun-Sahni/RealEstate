import { verifyUserSession } from '@/lib/dal'
import connectDB from '@/lib/database'
import { User } from '@/models'
import ProfileForm from './profile-form'

export const metadata = {
  title: "My Profile",
  description: "Manage your Gurgaon Elite Estate account details and password.",
}

const Profile = async () => {
  const session = await verifyUserSession()

  await connectDB()
  const user = await User.findById(session.userId).select("username email avatar role isVerified createdAt").lean()

  const profileUser = {
    username: user?.username ?? "",
    email: user?.email ?? "",
    avatar: user?.avatar ?? "",
    role: user?.role ?? "USER",
    isVerified: user?.isVerified ?? false,
    createdAt: user?.createdAt ? new Date(user.createdAt).toISOString() : new Date().toISOString(),
  }

  return (
    <main className="min-h-screen px-4 pt-24 pb-16 md:pt-28">
      <div className="container mx-auto flex max-w-4xl flex-col gap-8">
        <div>
          <h1 className="font-playfair text-3xl font-bold md:text-4xl">My Profile</h1>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">Manage your account details and password.</p>
        </div>
        <ProfileForm user={profileUser} />
      </div>
    </main>
  )
}

export default Profile
