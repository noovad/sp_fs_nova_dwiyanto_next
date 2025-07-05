"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TaskAnalyticsChart from "@/components/task-analytics-chart";

type ProjectStatusSummary = {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
};

type Project = {
  id: string;
  name: string;
  ownerName: string;
  createdAt: string;
  taskSummary: ProjectStatusSummary;
  isOwner: boolean;
};

const dummyProjects: Project[] = [
  {
    id: "1",
    name: "Website Redesign",
    ownerName: "Alice Johnson",
    createdAt: "2025-07-01T10:00:00Z",
    taskSummary: {
      total: 12,
      todo: 3,
      inProgress: 5,
      done: 4,
    },
    isOwner: true,
  },
  {
    id: "2",
    name: "Marketing Campaign",
    ownerName: "Bob Smith",
    createdAt: "2025-06-20T14:30:00Z",
    taskSummary: {
      total: 8,
      todo: 1,
      inProgress: 2,
      done: 5,
    },
    isOwner: false,
  },
  {
    id: "3",
    name: "Mobile App Development",
    ownerName: "You",
    createdAt: "2025-05-10T08:15:00Z",
    taskSummary: {
      total: 20,
      todo: 5,
      inProgress: 10,
      done: 5,
    },
    isOwner: true,
  },
];

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function DashboardPage() {
  const [projects, setProjects] = useState(dummyProjects);
  const [newProjectName, setNewProjectName] = useState("");

  function handleCreateProject() {
    if (!newProjectName.trim()) return;

    const newProject: Project = {
      id: (projects.length + 1).toString(),
      name: newProjectName,
      ownerName: "You",
      createdAt: new Date().toISOString(),
      taskSummary: { total: 0, todo: 0, inProgress: 0, done: 0 },
      isOwner: true,
    };

    setProjects([newProject, ...projects]);
    setNewProjectName("");
  }

  const analyticsData = projects.map((project) => ({
    name:
      project.name.length > 15
        ? project.name.slice(0, 12) + "..."
        : project.name,
    todo: project.taskSummary.todo,
    inProgress: project.taskSummary.inProgress,
    done: project.taskSummary.done,
  }));

  return (
    <div className="w-full max-w-6xl p-6 space-y-6">
      <TaskAnalyticsChart data={analyticsData} />
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Your Projects</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create Project</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Enter project name"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateProject}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="h-fit hover:shadow-lg transition-shadow duration-200"
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg mb-1 truncate">
                    {project.name}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {project.isOwner
                      ? "Owned by you"
                      : `Owned by ${project.ownerName}`}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="shrink-0">
                  Total: {project.taskSummary.total}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 pb-4">
              <p className="text-sm text-muted-foreground">
                Created: {formatDate(project.createdAt)}
              </p>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center">
                  <Badge
                    variant="secondary"
                    className="w-full justify-center text-xs bg-blue-100 text-blue-800"
                  >
                    To-do
                  </Badge>
                  <p className="text-sm font-medium mt-1">
                    {project.taskSummary.todo}
                  </p>
                </div>
                <div className="text-center">
                  <Badge
                    variant="secondary"
                    className="w-full justify-center text-xs bg-yellow-100 text-yellow-800"
                  >
                    In Progress
                  </Badge>
                  <p className="text-sm font-medium mt-1">
                    {project.taskSummary.inProgress}
                  </p>
                </div>
                <div className="text-center">
                  <Badge
                    variant="secondary"
                    className="w-full justify-center text-xs bg-green-100 text-green-800"
                  >
                    Done
                  </Badge>
                  <p className="text-sm font-medium mt-1">
                    {project.taskSummary.done}
                  </p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-end gap-2 pt-2">
              {!project.isOwner && (
                <Button variant="outline" size="sm">
                  Leave Project
                </Button>
              )}
              <Button asChild size="sm">
                <Link
                  href={`/projects/${encodeURIComponent(
                    project.name.toLowerCase().replace(/\s+/g, "-")
                  )}`}
                >
                  Open
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
