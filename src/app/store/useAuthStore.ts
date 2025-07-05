import { create } from "zustand";
import { toast } from "sonner";
import axiosApp from "@/lib/axiosApp";
import { getErrorMessage } from "@/lib/utils";

interface AuthState {
    loading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    register: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set) => ({
    loading: false,

    login: async (email, password) => {
        set({ loading: true });
        try {
            console.log("Logging in", { email, password });
            const resp = await axiosApp.post("/login", { email, password });
            console.log("Login response:", resp);
            toast.success("Login successful");
            return true;
        } catch (error) {
            console.error("Login error:", error);
            const message = getErrorMessage(error, "Login failed. Please check your credentials.");
            toast.error(message);
            return false;
        } finally {
            set({ loading: false });
        }
    },

    register: async (email, password) => {
        set({ loading: true });
        console.log("Registering user:", { email, password });
        try {
            await axiosApp.post("/register", { email, password });
            toast.success("Registration successful");
            return true;
        } catch (error) {
            console.error("Registration error:", error);
            const message = getErrorMessage(error, "Registration failed. Please try again.");
            toast.error(message);
            return false;
        } finally {
            set({ loading: false });
        }
    },

    logout: async () => {
        set({ loading: true });
        try {
            await axiosApp.post("/logout");
            toast.success("Logout successful");
            return true;
        } catch (error) {
            const message = getErrorMessage(error, "Logout failed.");
            toast.error(message);
            return false;
        } finally {
            set({ loading: false });
        }
    },
}));