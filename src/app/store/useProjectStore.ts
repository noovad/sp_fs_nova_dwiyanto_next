import { create } from "zustand";
import { toast } from "sonner";
import axiosApp from "@/lib/axiosApp";
import { getErrorMessage } from "@/lib/utils";
import { Project, ProjectApiResponse } from "@/dto/dtos";

interface ProjectState {
    loading: boolean;
    projects: Project[];
    currentProject: Project | null;
    getAllProjects: () => Promise<boolean>;
    createProject: (name: string) => Promise<boolean>;
    getProjectBySlug: (slug: string) => Promise<Project | null>;
    updateProject: (id: string, data: Partial<Project>) => Promise<boolean>;
    deleteProject: (id: string) => Promise<boolean>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
    loading: false,
    projects: [],
    currentProject: null,

    getAllProjects: async () => {
        set({ loading: true });
        try {
            const response = await axiosApp.get("/projects");
            set({ projects: response.data.data });
            return true;
        } catch (error) {
            const message = getErrorMessage(error, "Failed to fetch projects.");
            toast.error(message);
            return false;
        } finally {
            set({ loading: false });
        }
    },

    createProject: async (name) => {
        set({ loading: true });
        try {
            await axiosApp.post("/project", { name });
            toast.success("Project created successfully");
            get().getAllProjects();
            return true;
        } catch (error) {
            const message = getErrorMessage(error, "Failed to create project.");
            toast.error(message);
            return false;
        } finally {
            set({ loading: false });
        }
    },

    getProjectBySlug: async (slug) => {
        set({ loading: true });
        try {
            const response = await axiosApp.get<ProjectApiResponse>(`/project/${slug}`);
            const project = response.data.data;
            set({ currentProject: project });
            return project;
        } catch (error) {
            const message = getErrorMessage(error, "Failed to fetch project.");
            toast.error(message);
            return null;
        } finally {
            set({ loading: false });
        }
    },

    updateProject: async (id, data) => {
        set({ loading: true });
        try {
            await axiosApp.put(`/project/${id}`, data);
            toast.success("Project updated successfully");
            const currentProject = get().currentProject;
            if (currentProject && currentProject.id === id) {
                set({ currentProject: { ...currentProject, ...data } });
            }
            get().getAllProjects();
            return true;
        } catch (error) {
            const message = getErrorMessage(error, "Failed to update project.");
            toast.error(message);
            return false;
        } finally {
            set({ loading: false });
        }
    },

    deleteProject: async (id) => {
        set({ loading: true });
        try {
            await axiosApp.delete(`/project/${id}`);
            toast.success("Project deleted successfully");
            const projects = get().projects.filter(p => p.id !== id);
            set({ projects });
            const currentProject = get().currentProject;
            if (currentProject && currentProject.id === id) {
                set({ currentProject: null });
            }
            return true;
        } catch (error) {
            const message = getErrorMessage(error, "Failed to delete project.");
            toast.error(message);
            return false;
        } finally {
            set({ loading: false });
        }
    },
}));
