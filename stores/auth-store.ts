import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { AuthStore } from "@/types/auth"

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isHydrated: false,

      login: (username: string, token: string) => {
        set({
          user: { username, token },
          isAuthenticated: true,
        })
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        })
      },

      setHydrated: (state: boolean) => set({ isHydrated: state }),
    }),
    {
      name: "fakestore-auth-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true)
      },
    }
  )
)
