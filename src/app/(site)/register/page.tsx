import type { Metadata } from "next";
import Link from "next/link";

import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create an Arven account to track orders and save your details.",
};

export default function RegisterPage() {
  return (
    <div className="container-wide flex min-h-[70vh] items-center justify-center py-20">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="eyebrow mb-3">Join us</p>
          <h1 className="font-serif text-3xl text-foreground">Create Account</h1>
        </div>
        <RegisterForm />
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-foreground underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
