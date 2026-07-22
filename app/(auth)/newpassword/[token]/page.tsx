"use client"
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Logo from '@/components/user/common/logo'
import axios, { AxiosError } from 'axios'
import { Eye, EyeClosed, Loader2, XCircle } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const NewPassword = () => {
    const { token } = useParams<{ token: string }>();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState<{
        password: string, confirmpassword: string, token: string
    }>({
        password: "",
        confirmpassword: "",
        token: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            if (form.password !== form.confirmpassword) {
                toast.error("Password and Confirm Password must be same");
                return;
            }
            setLoading(true);
            const response = await axios.post("/api/user/auth/newpassword", form, { withCredentials: true })
            if (response?.data?.success) {
                toast.success(response?.data?.message)
                router.push("/")
            }
        } catch (error) {
            const err = error as AxiosError<any>;
            const message = err.response?.data?.message || err.message || "Something went wrong";
            toast.error(message);
        } finally {
            setLoading(false);
            setForm({
                password: "",
                confirmpassword: "",
                token: ""
            })
        }
    }

    useEffect(() => {
        const verifyAccount = async () => {
            try {
                setStatus("loading");
                setForm({
                    ...form,
                    token: token
                })
                const response = await axios.get(`/api/user/auth/passworresetverify/${token}`);
                if (response?.data?.success) {
                    setStatus("success");
                } else {
                    setStatus("error");
                }
            } catch (err) {
                setStatus("error");
            }
        };
        if (token) verifyAccount();
    }, [token, router]);
    return (
        <div className="flex flex-col items-center justify-center px-8 lg:w-2/5 w-full gap-8">
            {/* LOADING */}
            {status === "loading" && (
                <div className="w-full max-w-md text-center bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-lg">
                    <Loader2 className="animate-spin mx-auto text-yellow-500" size={40} />
                    <h1 className="mt-4 text-xl font-semibold text-gray-800 dark:text-white capitalize">
                        Verifying...
                    </h1>
                    <p className="text-sm text-gray-500 mt-2">
                        Please wait while we confirm your email.
                    </p>
                </div>
            )}
            {/* SUCCESS */}
            {status === "success" && (
                <>
                    <Logo
                        width={120}
                        height={120}
                    />
                    <div className='flex flex-col gap-4 items-center'>
                        <h1 className='font-playfair text-5xl md:text-6xl font-medium text-center'>Set New Password</h1>
                        <p className='text-sm tracking-wider text-muted-foreground max-w-sm text-wrap text-center'>Create a new password for your account. Make sure it's strong and easy for you to remember.</p>
                    </div>
                    <form onSubmit={handleSubmit} className='grid gap-10 w-full max-w-md'>
                        <div className='grid gap-4'>
                            <Label htmlFor="password">Password</Label>
                            <div className='relative'>
                                <Input
                                    id='password'
                                    name="password"
                                    value={form?.password}
                                    onChange={handleChange}
                                    type={showPassword ? "text" : "password"}
                                    placeholder='**************'
                                    className="bg-slate-100 dark:bg-neutral-950 border-0 border-b border-b-gray-300 dark:border-b-gray-800 rounded-none shadow-none focus-visible:border-b-yellow-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                                />
                                <Button type='button' className='absolute bottom-0 right-0 cursor-pointer' variant="link" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ?
                                        <Eye /> :
                                        <EyeClosed />
                                    }
                                </Button>
                            </div>
                        </div>
                        <div className='grid gap-4'>
                            <Label htmlFor="confirmpassword">Confirm Password</Label>
                            <div className='relative'>
                                <Input
                                    id='confirmpassword'
                                    name="confirmpassword"
                                    value={form?.confirmpassword}
                                    onChange={handleChange}
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder='**************'
                                    className="bg-slate-100 dark:bg-neutral-950 border-0 border-b border-b-gray-300 dark:border-b-gray-800 rounded-none shadow-none focus-visible:border-b-yellow-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                                />
                                <Button type='button' className='absolute bottom-0 right-0 cursor-pointer' variant="link" onClick={() => setShowConfirmPassword(!showPassword)}>
                                    {showPassword ?
                                        <Eye /> :
                                        <EyeClosed />
                                    }
                                </Button>
                            </div>
                        </div>

                        <Button className={`py-6 rounded-full bg-yellow-500 hover:bg-yellow-500/80 ${loading ? "cursor-not-allowed" : "cursor-pointer"}`} disabled={loading}>
                            {
                                loading ?
                                    <>
                                        <Loader2 className='animate-spin' />
                                        Submitting...
                                    </> :
                                    "Submit"
                            }
                        </Button>

                    </form>
                </>
            )}
            {/* ERROR */}
            {status === "error" && (
                <div className="w-full max-w-md text-center bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-lg">
                    <XCircle className="mx-auto text-red-500" size={45} />
                    <h1 className="mt-4 text-xl font-semibold text-red-600">
                        Verification Failed
                    </h1>
                    <p className="text-sm text-gray-500 mt-2">
                        The link is invalid or expired.
                    </p>
                </div>
            )}
        </div>
    )
}

export default NewPassword