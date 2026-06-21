import Image from "next/image";

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
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
      {children}
    </main>
  )
}
