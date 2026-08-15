"use client"
import { Badge } from "@/components/ui/badge"
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Label } from "@/components/ui/label"

interface VisitBookingProp {
    fullName: string;
    email: string;
    phone: string;
    message?: string;
    status: "PENDING" | "COMPLETED";
    property?: { title: string; slug: string };
    createdAt: string;
}

const ViewVisitBooking = ({ booking }: { booking: VisitBookingProp }) => {
    return (
        <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
                <DialogTitle className="font-inter capitalize">{booking.fullName}</DialogTitle>
                <DialogDescription>
                    Requested on {new Date(booking.createdAt).toLocaleDateString()}{" "}
                    {new Date(booking.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </DialogDescription>
            </DialogHeader>
            <FieldGroup>
                <Field>
                    <Label>Status</Label>
                    {booking.status === "COMPLETED" ? (
                        <Badge variant="default" className="w-fit tracking-wider">
                            Completed
                        </Badge>
                    ) : (
                        <Badge className="w-fit animate-pending-glow gap-1.5 border-amber-500/40 bg-amber-500/15 tracking-wider text-amber-600 dark:text-amber-400">
                            <span className="size-1.5 rounded-full bg-amber-500" />
                            Pending
                        </Badge>
                    )}
                </Field>
                <Field>
                    <Label>Property</Label>
                    <p className="text-sm">{booking.property?.title ?? "—"}</p>
                </Field>
                <Field>
                    <Label>Email</Label>
                    <p className="text-sm">{booking.email}</p>
                </Field>
                <Field>
                    <Label>Phone</Label>
                    <p className="text-sm">{booking.phone}</p>
                </Field>
                <Field>
                    <Label>Message</Label>
                    <p className="text-sm whitespace-pre-wrap">{booking.message || "—"}</p>
                </Field>
            </FieldGroup>
        </DialogContent>
    )
}

export default ViewVisitBooking
