"use client";

import React from "react";
import { MailCheck } from "lucide-react";
import Link from "next/link";

const VerifyAccount = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black px-4">
            <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-8 text-center">
                {/* Icon */}
                <div className="flex justify-center mb-4">
                    <div className="bg-yellow-100 dark:bg-yellow-500/10 p-4 rounded-full">
                        <MailCheck className="text-yellow-600" size={32} />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Check your email
                </h1>

                {/* Message */}
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    We’ve sent a verification link to your email address.
                    Please check your inbox and click the link to activate your account.
                </p>

                {/* Hint */}
                <p className="mt-4 text-xs text-gray-500">
                    Didn’t receive the email? Check your spam folder or try again.
                </p>

                {/* Actions */}
                <div className="mt-6 flex flex-col gap-3">
                    <Link
                        href="/login"
                        className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-medium py-2 rounded-lg transition">
                        Go to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default VerifyAccount;