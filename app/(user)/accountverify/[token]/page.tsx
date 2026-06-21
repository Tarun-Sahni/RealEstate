"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

const VerifyPage = () => {
  const { token } = useParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const verifyAccount = async () => {
      try {
        setStatus("loading");
        const response = await axios.get(`/api/user/auth/accountverify/${token}`);
        if (response?.data?.success) {
          setStatus("success");
          setTimeout(() => {
            router.push("/login");
          }, 2000);
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black px-4">
      <div className="w-full max-w-md text-center bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-lg">

        {/* LOADING */}
        {status === "loading" && (
          <>
            <Loader2 className="animate-spin mx-auto text-yellow-500" size={40} />
            <h1 className="mt-4 text-xl font-semibold text-gray-800 dark:text-white capitalize">
              Verifying your account...
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Please wait while we confirm your email.
            </p>
          </>
        )}

        {/* SUCCESS */}
        {status === "success" && (
          <>
            <CheckCircle className="mx-auto text-green-500" size={45} />
            <h1 className="mt-4 text-xl font-semibold text-green-600">
              Account Verified!
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Redirecting you to login...
            </p>
          </>
        )}

        {/* ERROR */}
        {status === "error" && (
          <>
            <XCircle className="mx-auto text-red-500" size={45} />
            <h1 className="mt-4 text-xl font-semibold text-red-600">
              Verification Failed
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              The link is invalid or expired.
            </p>

            <button
              onClick={() => router.push("/accountverify")}
              className="mt-4 px-4 py-2 bg-yellow-500 text-black rounded-lg"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyPage;