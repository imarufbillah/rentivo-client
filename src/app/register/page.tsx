"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/useAuth";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { AppBreadcrumb } from "@/components/layout/AppBreadcrumb";

const RegisterPage = () => {
  const router = useRouter();
  const { data: session, isLoading } = useSession();

  useEffect(() => {
    if (!isLoading && session) {
      router.replace("/dashboard");
    }
  }, [session, isLoading, router]);

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
      <AppBreadcrumb segments={[{ label: "Sign Up" }]} />
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
