import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24" />}>
      <AuthForm mode="signup" />
    </Suspense>
  );
}
