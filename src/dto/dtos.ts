export type Task = {
    id: string;
    title: string;
    description?: string;
    status: "todo" | "in_progress" | "done";
    projectId: string;
    assigneeId: string;
    createdAt: string;
    updatedAt: string;
};

export type Owner = {
    id: string;
    email: string;
};

export type Project = {
    id: string;
    name: string;
    ownerId: string;
    createdAt: string;
    updatedAt: string;
    owner: Owner;
    tasks: Task[];
    memberships: User[];
};

export type ProjectApiResponse = {
    status: number;
    message: string;
    code: string;
    data: Project;
};

export type User = {
    id: string;
    email: string;
    createdAt: string;
    updatedAt: string;
};
