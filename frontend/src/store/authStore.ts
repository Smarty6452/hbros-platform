
import { create } from "zustand"

type User = {
  id: number
  name: string
  email: string
  role: "Poster" | "Viewer"
}

type AuthStore = {
  user: User | null
  token: string | null
  login: (token: string, user: User) => void
  logout: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: localStorage.getItem("token") || null,

  login: (token, user) => {
    localStorage.setItem("token", token)
    set({ token, user })
  },

  logout: () => {
    localStorage.removeItem("token")
    set({ token: null, user: null })
  },

  isAuthenticated: () => !!get().token,
}))
