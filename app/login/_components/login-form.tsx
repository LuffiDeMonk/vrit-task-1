"use client"

import React, { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { LogIn, KeyRound, User, Sparkles } from "lucide-react"
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

      <div className="mt-6 rounded-lg border border-dashed border-border bg-muted/30 p-3.5 text-xs">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-semibold text-foreground">
            <Sparkles className="size-3.5 text-amber-500" />
            Demo Credentials
          </span>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={handleFillDemo}
            className="h-6 px-2 text-[11px] text-primary hover:text-primary/80"
          >
            Fill in form
          </Button>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Username:{" "}
          <code className="rounded bg-muted px-1 font-mono text-foreground">
            {DEMO_CREDENTIALS.username}
          </code>
          {" · "}
          Password:{" "}
          <code className="rounded bg-muted px-1 font-mono text-foreground">
            {DEMO_CREDENTIALS.password}
          </code>
        </p>
      </div>
    </Card>
  )
}
