"use client"

import { useLinkStatus } from "next/link"
import { Loader2 } from "lucide-react"

// Must be a descendant of <Link> — swaps its children for a spinner while that specific link's navigation is pending.
const PaginationLinkStatus = ({ children }: { children: React.ReactNode }) => {
  const { pending } = useLinkStatus()
  return pending ? <Loader2 size={14} className="animate-spin" /> : <>{children}</>
}

export default PaginationLinkStatus
