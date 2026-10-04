import { Suspense } from "react"
import { LoginForm } from "@/app/login/_components/login-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign In | FakeStore Direct",
  description:
    "Sign in to your FakeStore Direct account to access your cart and orders.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function LoginPage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-14rem)] items-center justify-center px-4 py-12 sm:py-16">
      <Suspense
        fallback={
          <div className="h-96 w-full max-w-md animate-pulse rounded-xl bg-muted" />
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  )
}
