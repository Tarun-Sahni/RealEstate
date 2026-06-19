import { create } from 'zustand'

export const useAuth = create((set) => ({
    userId: "",
    username: "",
    email: "",
    avatar: "",
    role: "",
    setAuth: (userId: string, username: string, email: string, avatar: string, role: string) => set({ userId, username, email, avatar, role }),
    logOut: () => set({ userId: "", username: "", email: "", avatar: "", role: "" }),
}))