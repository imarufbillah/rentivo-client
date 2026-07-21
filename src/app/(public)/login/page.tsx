"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@/hooks/useAuth";
import { LoginForm } from "@/components/auth/LoginForm";
const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const { data: session, isLoading } = useSession();

  useEffect(() => {
    if (!isLoading && session) {
      router.replace(callbackUrl);
    }
  }, [session, isLoading, router, callbackUrl]);

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (session) return null;

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
