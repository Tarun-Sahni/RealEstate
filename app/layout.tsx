import type { Metadata } from "next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Playfair, Inter } from "next/font/google"
import "@/app/globals.css"
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme/themeprovider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BRAND_NAME } from "@/lib/contant";

const playfair = Playfair({
  subsets: ["latin"],
  variable: "--font-playfair",
})
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const SITE_URL = process.env.CLIENT_URL || "http://localhost:3000";
const SITE_DESCRIPTION = "Find apartments, villas, plots and commercial properties for sale and rent in Gurgaon. Gurgaon Elite Estate connects buyers, sellers and investors with verified listings and trusted local expertise.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND_NAME} | Real Estate Agency in Gurgaon`,
    template: `%s | ${BRAND_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "real estate Gurgaon",
    "properties for sale Gurgaon",
    "flats for rent Gurgaon",
    "villas in Gurgaon",
    "commercial property Gurgaon",
    "plots for sale Gurgaon",
    "Gurgaon Elite Estate",
  ],
  openGraph: {
    type: "website",
    siteName: BRAND_NAME,
    title: `${BRAND_NAME} | Real Estate Agency in Gurgaon`,
    description: SITE_DESCRIPTION,
    images: ["/hero.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND_NAME} | Real Estate Agency in Gurgaon`,
    description: SITE_DESCRIPTION,
    images: ["/hero.png"],
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", playfair.variable, "font-sans", inter.variable)}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}
