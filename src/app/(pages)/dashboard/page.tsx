"use client";

import { useState, useEffect } from "react";
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
import { formatDate } from "@/lib/date";
import { useProjectStore } from "@/app/store/useProjectStore";

export default function DashboardPage() {
  const projects = useProjectStore((state) => state.projects);
  const loading = useProjectStore((state) => state.loading);
  const getAllProjects = useProjectStore((state) => state.getAllProjects);
  const createProject = useProjectStore((state) => state.createProject);
  const [newProjectName, setNewProjectName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    getAllProjects();
  }, [getAllProjects]);

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;

    const success = await createProject(newProjectName);
    if (success) {
      setNewProjectName("");
      setIsDialogOpen(false);
    }
  };

  const analyticsData = projects.map((project) => ({
    name:
      project.name.length > 15
        ? project.name.slice(0, 12) + "..."
        : project.name,
    todo: project.tasks?.filter((t) => t.status === "todo").length || 0,
    inProgress:
      project.tasks?.filter((t) => t.status === "in_progress").length || 0,
    done: project.tasks?.filter((t) => t.status === "done").length || 0,
  }));

  if (loading && projects.length === 0) {
    return (
      <div className="w-full max-w-6xl p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 space-y-6">
      <TaskAnalyticsChart data={analyticsData} />
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Your Projects</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
              <Button
                onClick={handleCreateProject}
                disabled={loading || !newProjectName.trim()}
              >
                {loading ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          const taskCounts = {
            total: project.tasks?.length || 0,
            todo: project.tasks?.filter((t) => t.status === "todo").length || 0,
            inProgress:
              project.tasks?.filter((t) => t.status === "in_progress").length ||
              0,
            done: project.tasks?.filter((t) => t.status === "done").length || 0,
          };

          return (
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
                      Owned by {project.owner?.email || "Unknown"}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="shrink-0">
                    Total: {taskCounts.total}
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
                      {taskCounts.todo}
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
                      {taskCounts.inProgress}
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
                      {taskCounts.done}
                    </p>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex justify-end gap-2 pt-2">
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
          );
        })}
      </div>
    </div>
  );
}
