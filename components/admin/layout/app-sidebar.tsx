"use client"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavMain } from "./nav-main"
import { Home, LogOut, Loader2, LandPlot, Layers2, Layers } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import axios, { AxiosError } from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: Home,
    },
    {
      title: "Categoy",
      url: "/admin/category",
      icon: Layers2,
    },
    {
      title: "SubCategoy",
      url: "/admin/subcategory",
      icon: Layers,
    },
    {
      title: "Property",
      url: "/admin/property",
      icon: LandPlot,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      const response = await axios.post("/api/admin/logout", {}, { withCredentials: true })
      if (response?.data?.success) {
        toast.success(response?.data?.message)
        router.push("/admin/auth")
      }
    } catch (error) {
      const err = error as AxiosError<any>;
      const message = err.response?.data?.message || err.message || "Something went wrong";
      toast.error(message);
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/admin" className="flex justify-center text-xl font-bold tracking-wider capitalize">
              Gurgaon Real Estate
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavDocuments items={data.documents} /> */}
      </SidebarContent>
      <SidebarFooter>
        <Button
          onClick={handleLogout}
          disabled={loggingOut}
          className={`flex justify-center items-center gap-2 ${loggingOut ? "cursor-not-allowed" : "cursor-pointer"}`}
        >
          {loggingOut ?
            <Loader2 className="animate-spin" /> :
            <LogOut />
          }
          Log Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
