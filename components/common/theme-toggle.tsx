"use client"

import { useSyncExternalStore } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/shared/button"
import { Tooltip } from "@/components/shared/tooltip"

const emptySubscribe = () => () => {}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" aria-label="Toggle theme">
        <Sun className="size-4 text-muted-foreground" />
      </Button>
    )
  }

  return (
    <Tooltip
      title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
      placement="bottom"
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        aria-label="Toggle theme"
      >
        {resolvedTheme === "dark" ? (
          <Sun className="size-4 text-amber-400 transition-all" />
        ) : (
          <Moon className="size-4 text-foreground transition-all" />
        )}
      </Button>
    </Tooltip>
  )
}
