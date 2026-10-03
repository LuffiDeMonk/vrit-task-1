"use client"

import React, { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { LogIn, KeyRound, User } from "lucide-react"
import { Input } from "@/components/shared/input"
import { Button } from "@/components/shared/button"
import { Alert } from "@/components/shared/alert"
import { Card } from "@/components/ui/card"
import { loginUser } from "@/lib/api/auth"
import { useAuth } from "@/hooks/use-auth"
import { DEMO_CREDENTIALS } from "@/lib/constants"

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get("redirect") || "/products"

  const { login } = useAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleFillDemo = () => {
    setUsername(DEMO_CREDENTIALS.username)
    setPassword(DEMO_CREDENTIALS.password)
    setErrorMessage(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    startTransition(async () => {
      const result = await loginUser({ username, password })

      if (result.success) {
        login(username, result.token)
        router.push(redirectUrl)
      } else {
        setErrorMessage(result.message)
      }
    })
  }

  return (
    <Card className="w-full max-w-md border-border bg-card p-6 shadow-md sm:p-8">
      <div className="mb-6 text-center">
        <div className="mb-3 inline-flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
          <LogIn className="size-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Welcome Back
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Sign in to access your shopping cart and manage your orders.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-4">
          <Alert
            variant="destructive"
            title="Authentication Error"
            description={errorMessage}
            dismissible
            onClose={() => setErrorMessage(null)}
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="username"
          type="text"
          label="Username"
          required
          placeholder="e.g. mor_2314"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isPending}
          startIcon={<User className="size-4 text-muted-foreground" />}
          preventSqlInjection
        />

        <Input
          id="password"
          type="password"
          label="Password"
          required
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isPending}
          startIcon={<KeyRound className="size-4 text-muted-foreground" />}
        />

        <Button
          type="submit"
          size="lg"
          loading={isPending}
          disabled={isPending}
          className="mt-2 w-full font-semibold"
        >
          {isPending ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-muted-foreground">
        <span>Need demo access? </span>
        <button
          type="button"
          onClick={handleFillDemo}
          className="cursor-pointer font-medium text-primary underline underline-offset-4 hover:text-primary/80"
        >
          Autofill credentials
        </button>
      </div>
    </Card>
  )
}
