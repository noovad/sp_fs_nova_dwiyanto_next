export type Task = {
    id: string;
    title: string;
    description?: string | null;
    status: "todo" | "in_progress" | "done";
    projectId: string;
    assigneeId: string;
    createdAt: string;
    updatedAt: string;
    assignee: {
        id: string;
        email: string;
    };
    project: {
        id: string;
        name: string;
    };
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
