"use client"

import { useAuthStore } from "@/stores/auth-store"

export function useAuth() {
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isHydrated = useAuthStore((state) => state.isHydrated)
  const login = useAuthStore((state) => state.login)
  const logout = useAuthStore((state) => state.logout)

  return {
    user: isHydrated ? user : null,
    isAuthenticated: isHydrated ? isAuthenticated : false,
    isHydrated,
    login,
    logout,
  }
}
