import { Playfair, Inter } from "next/font/google"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";

const playfair = Playfair({
  subsets: ["latin"],
  variable: "--font-playfair",
})
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", playfair.variable, "font-sans", inter.variable)}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
