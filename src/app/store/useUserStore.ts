import { create } from "zustand";
import { toast } from "sonner";
import axiosApp from "@/lib/axiosApp";
import { getErrorMessage } from "@/lib/utils";

interface User {
    id: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

interface CreateUserData {
    email: string;
    password: string;
}

interface UserState {
    users: User[];
    currentUser: User | null;
    me: User | null;
    createUser: (data: CreateUserData) => Promise<boolean>;
    deleteUser: (id: string) => Promise<boolean>;
    getMe: () => Promise<boolean>;
}

export const useUserStore = create<UserState>((set, get) => ({
    users: [],
    currentUser: null,
    me: null,

    createUser: async (data) => {
        try {
            const response = await axiosApp.post("/user", data);
            const newUser = response.data.data;
            toast.success("User created successfully");
            const users = get().users;
            set({ users: [...users, newUser] });
            return true;

        } catch (error) {
            const message = getErrorMessage(error, "Failed to create user.");
            toast.error(message);
            return false;
        }
    },

    deleteUser: async (id) => {
        try {
            await axiosApp.delete(`/user/${id}`);
            toast.success("User deleted successfully");
            const users = get().users.filter(user => user.id !== id);
            set({ users });
            const currentUser = get().currentUser;
            if (currentUser && currentUser.id === id) {
                set({ currentUser: null });
            }
            return true;

        } catch (error) {
            const message = getErrorMessage(error, "Failed to delete user.");
            toast.error(message);
            return false;
        }
    },

    getMe: async () => {
        try {
            const response = await axiosApp.get("/me");
            const user = response.data.data;
            set({ me: user });
            return true;
        } catch (error) {
            const message = getErrorMessage(error, "Failed to fetch user data.");
            toast.error(message);
            return false;
        }
    }
}));
