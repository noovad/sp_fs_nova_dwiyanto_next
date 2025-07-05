import { create } from "zustand";
import { toast } from "sonner";
import axiosApp from "@/lib/axiosApp";
import { getErrorMessage } from "@/lib/utils";

interface ProjectMember {
    id: string;
    projectId: string;
    userId: string;
    user?: {
        id: string;
        email: string;
    };
    createdAt: string;
    updatedAt: string;
}

interface CreateProjectMemberData {
    projectId: string;
    email: string;
}

interface ProjectMemberState {
    loading: boolean;
    members: ProjectMember[];
    currentMember: ProjectMember | null;
    getAllProjectMembers: (projectId: string) => Promise<boolean>;
    createProjectMember: (data: CreateProjectMemberData) => Promise<boolean>;
    getProjectMemberById: (id: string) => Promise<boolean>;
    deleteProjectMember: (id: string) => Promise<boolean>;
}

export const useProjectMemberStore = create<ProjectMemberState>((set, get) => ({
    loading: false,
    members: [],
    currentMember: null,

    getAllProjectMembers: async (projectId) => {
        set({ loading: true });
        try {
            const response = await axiosApp.get("/project-members", {
                params: { projectId }
            });
            set({ members: response.data.data });
            return true;
        } catch (error) {
            const message = getErrorMessage(error, "Failed to fetch project members.");
            toast.error(message);
            return false;
        } finally {
            set({ loading: false });
        }
    },

    createProjectMember: async (data) => {
        set({ loading: true });
        try {
            const response = await axiosApp.post("/project-member", data);
            const newMember = response.data.data;
            toast.success("Project member added successfully");
            const members = get().members;
            set({ members: [...members, newMember] });
            return true;
        } catch (error) {
            const message = getErrorMessage(error, "Failed to add project member.");
            toast.error(message);
            return false;
        } finally {
            set({ loading: false });
        }
    },

    getProjectMemberById: async (id) => {
        set({ loading: true });
        try {
            const response = await axiosApp.get(`/project-member/${id}`);
            const member = response.data.data;
            set({ currentMember: member });
            return true;
        } catch (error) {
            const message = getErrorMessage(error, "Failed to fetch project member.");
            toast.error(message);
            return false;
        } finally {
            set({ loading: false });
        }
    },

    deleteProjectMember: async (id) => {
        set({ loading: true });
        try {
            await axiosApp.delete(`/project-member/${id}`);
            toast.success("Project member removed successfully");
            const members = get().members.filter(member => member.id !== id);
            set({ members });
            const currentMember = get().currentMember;
            if (currentMember && currentMember.id === id) {
                set({ currentMember: null });
            }
            return true;
        } catch (error) {
            const message = getErrorMessage(error, "Failed to remove project member.");
            toast.error(message);
            return false;
        } finally {
            set({ loading: false });
        }
    },
}));
