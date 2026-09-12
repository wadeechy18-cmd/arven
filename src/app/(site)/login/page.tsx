import type { Metadata } from "next";
import Link from "next/link";

import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Arven account to track orders and checkout faster.",
};

export default function LoginPage() {
  return (
    <div className="container-wide flex min-h-[70vh] items-center justify-center py-20">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="eyebrow mb-3">Welcome back</p>
          <h1 className="font-serif text-3xl text-foreground">Sign In</h1>
        </div>
        <LoginForm />
        <p className="mt-8 text-center text-sm text-muted-foreground">
          New here?{" "}
          <Link href="/register" className="text-foreground underline underline-offset-4">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
