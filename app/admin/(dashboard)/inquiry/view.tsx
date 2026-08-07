"use client"
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Label } from "@/components/ui/label"

interface InquiryProp {
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    message: string;
    createdAt: string;
}

const ViewInquiry = ({ inquiry }: { inquiry: InquiryProp }) => {
    return (
        <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
                <DialogTitle className="font-inter capitalize">
                    {inquiry.firstname} {inquiry.lastname}
                </DialogTitle>
                <DialogDescription>
                    Received on {new Date(inquiry.createdAt).toLocaleDateString()}{" "}
                    {new Date(inquiry.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </DialogDescription>
            </DialogHeader>
            <FieldGroup>
                <Field>
                    <Label>Email</Label>
                    <p className="text-sm">{inquiry.email}</p>
                </Field>
                <Field>
                    <Label>Phone</Label>
                    <p className="text-sm">{inquiry.phone}</p>
                </Field>
                <Field>
                    <Label>Message</Label>
                    <p className="text-sm whitespace-pre-wrap">{inquiry.message}</p>
                </Field>
            </FieldGroup>
        </DialogContent>
    )
}

export default ViewInquiry
