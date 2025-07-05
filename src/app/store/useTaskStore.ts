import { create } from "zustand";
import { toast } from "sonner";
import axiosApp from "@/lib/axiosApp";
import { getErrorMessage } from "@/lib/utils";
import { Task } from "@/dto/dtos";

interface CreateTaskData {
    projectId: string;
    title: string;
    assigneeId: string;
    status: Task["status"];
    description?: string;
}

interface UpdateTaskData {
    title?: string;
    assigneeId?: string;
    status?: Task["status"];
    description?: string;
}

interface TaskState {
    loading: boolean;
    tasks: Task[];
    currentTask: Task | null;
    getAllTasks: (id: string) => Promise<boolean>;
    createTask: (data: CreateTaskData) => Promise<Task | null>;
    updateTask: (id: string, data: UpdateTaskData) => Promise<boolean>;
    updateLocalTask: (id: string, data: UpdateTaskData) => void;
    deleteTask: (id: string) => Promise<boolean>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
    loading: false,
    tasks: [],
    currentTask: null,

    getAllTasks: async (id) => {
        set({ loading: true });
        try {
            const response = await axiosApp.get("/tasks/" + id);
            set({ tasks: response.data.data });
            return true;
        } catch (error) {
            const message = getErrorMessage(error, "Failed to fetch tasks.");
            toast.error(message);
            return false;
        } finally {
            set({ loading: false });
        }
    },

    createTask: async (data) => {
        set({ loading: true });
        try {
            const response = await axiosApp.post("/task", data);
            if (response.data.status === 201) {
                const newTask = response.data.data;
                toast.success("Task created successfully");
                const tasks = get().tasks;
                set({ tasks: [...tasks, newTask] });
                return newTask;
            } else {
                toast.error("Failed to create task");
                return null;
            }
        } catch (error) {
            const message = getErrorMessage(error, "Failed to create task.");
            toast.error(message);
            return null;
        } finally {
            set({ loading: false });
        }
    },

    updateLocalTask: (id, data) => {
        const tasks = get().tasks;
        const updatedTasks = tasks.map(task =>
            task.id === id ? { ...task, ...data } : task
        );
        set({ tasks: updatedTasks });

        const currentTask = get().currentTask;
        if (currentTask && currentTask.id === id) {
            set({ currentTask: { ...currentTask, ...data } });
        }
    },

    updateTask: async (id, data) => {
        set({ loading: true });
        try {
            await axiosApp.put(`/task/${id}`, data);
            toast.success("Task updated successfully");
            const tasks = get().tasks.map(task =>
                task.id === id ? { ...task, ...data } : task
            );
            set({ tasks });

            const currentTask = get().currentTask;
            if (currentTask && currentTask.id === id) {
                set({ currentTask: { ...currentTask, ...data } });
            }

            return true;
        } catch (error) {
            const message = getErrorMessage(error, "Failed to update task.");
            toast.error(message);
            return false;
        } finally {
            set({ loading: false });
        }
    },

    deleteTask: async (id) => {
        set({ loading: true });
        try {
            await axiosApp.delete(`/task/${id}`);
            toast.success("Task deleted successfully");
            const tasks = get().tasks.filter(task => task.id !== id);
            set({ tasks });
            const currentTask = get().currentTask;
            if (currentTask && currentTask.id === id) {
                set({ currentTask: null });
            }
            return true;

        } catch (error) {
            const message = getErrorMessage(error, "Failed to delete task.");
            toast.error(message);
            return false;
        } finally {
            set({ loading: false });
        }
    },
}));
