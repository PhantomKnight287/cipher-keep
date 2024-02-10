import { Metadata } from "next";
import Link from "next/link";
import { UserAuthForm } from "./page.client";
import BackButton from "@/components/shared/back";
import { ShieldCheck } from "lucide-react";

export default async function LoginPage() {
  return (
    <div className="container flex min-h-screen h-screen w-screen flex-col items-center justify-center bg-background">
      <BackButton className="absolute left-4 top-4 md:left-8 md:top-8" />

      <div className="mx-auto flex w-full flex-col justify-center gap-6 sm:w-[350px]">
        <div className="flex flex-col gap-2 text-center">
          <ShieldCheck className="mx-auto h-8 w-8 text-green-500" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your username to sign in to your email
          </p>
        </div>
        {/* the actual login part */}
        <UserAuthForm />
        <p className="px-8 text-center text-sm text-muted-foreground flex flex-col gap-2">
          <Link
            href="/register"
            className="hover:text-muted-foreground underline underline-offset-4"
          >
            Don&apos;t have an account? Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Login",
  description: "Login to your account",
  robots: {
    index: false,
    follow: false,
  },
} satisfies Metadata;
