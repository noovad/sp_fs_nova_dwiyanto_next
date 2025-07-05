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
    loading: boolean;
    users: User[];
    currentUser: User | null;
    createUser: (data: CreateUserData) => Promise<User | null>;
    deleteUser: (id: string) => Promise<boolean>;
}

export const useUserStore = create<UserState>((set, get) => ({
    loading: false,
    users: [],
    currentUser: null,

    createUser: async (data) => {
        set({ loading: true });
        try {
            const response = await axiosApp.post("/user", data);
            if (response.data.status === 201) {
                const newUser = response.data.data;
                toast.success("User created successfully");
                const users = get().users;
                set({ users: [...users, newUser] });
                return newUser;
            } else {
                toast.error("Failed to create user");
                return null;
            }
        } catch (error) {
            const message = getErrorMessage(error, "Failed to create user.");
            toast.error(message);
            return null;
        } finally {
            set({ loading: false });
        }
    },

    deleteUser: async (id) => {
        set({ loading: true });
        try {
            const response = await axiosApp.delete(`/user/${id}`);
            if (response.data.status === 200) {
                toast.success("User deleted successfully");
                const users = get().users.filter(user => user.id !== id);
                set({ users });
                const currentUser = get().currentUser;
                if (currentUser && currentUser.id === id) {
                    set({ currentUser: null });
                }
                return true;
            } else {
                toast.error("Failed to delete user");
                return false;
            }
        } catch (error) {
            const message = getErrorMessage(error, "Failed to delete user.");
            toast.error(message);
            return false;
        } finally {
            set({ loading: false });
        }
    },
}));
