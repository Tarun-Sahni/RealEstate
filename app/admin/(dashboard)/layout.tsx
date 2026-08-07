import { AppSidebar } from "@/components/admin/layout/app-sidebar"
import { SiteHeader } from "@/components/admin/layout/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { verifyAdminSession } from "@/lib/dal"

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const { username } = await verifyAdminSession();

    return <SidebarProvider
        style={
            {
                "--sidebar-width": "calc(var(--spacing) * 72)",
                "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
        }
    >
        <AppSidebar variant="inset" />
        <SidebarInset>
            <SiteHeader username={username} />
            <main className="w-full h-full p-4">
            {children}
            </main>
        </SidebarInset>
    </SidebarProvider>
}