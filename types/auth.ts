export interface LoginCredentials {
  username: string
  password: string
}

export interface LoginResponse {
  token?: string
  accessToken?: string
  id?: number
  username?: string
  email?: string
  firstName?: string
  lastName?: string
}

export interface AuthUser {
  username: string
  token: string
}

export interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isHydrated: boolean
}

export interface AuthActions {
  login: (username: string, token: string) => void
  logout: () => void
  setHydrated: (state: boolean) => void
}

export type AuthStore = AuthState & AuthActions
