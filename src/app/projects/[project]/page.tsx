"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

type Task = {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "done";
};

type Project = {
  id: string;
  name: string;
  ownerName: string;
  createdAt: string;
  description?: string;
  tasks: Task[];
};

const dummyProject: Project = {
  id: "1",
  name: "Website Redesign",
  ownerName: "Alice Johnson",
  createdAt: "2025-07-01T10:00:00Z",
  description: "A full revamp of the marketing site and landing pages.",
  tasks: [
    {
      id: "t1",
      title: "Create wireframes",
      description: "Initial wireframes for homepage and about section.",
      status: "todo",
    },
    {
      id: "t2",
      title: "Design hero section",
      description: "Hero section with call-to-action and animations.",
      status: "in_progress",
    },
    {
      id: "t3",
      title: "Implement dark mode",
      status: "in_progress",
    },
    {
      id: "t4",
      title: "Publish landing page",
      status: "done",
    },
  ],
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getStatusColor(status: Task["status"]) {
  switch (status) {
    case "todo":
      return "bg-blue-100 text-blue-800";
    case "in_progress":
      return "bg-yellow-100 text-yellow-800";
    case "done":
      return "bg-green-100 text-green-800";
  }
}

function getColumnStyle(status: Task["status"]) {
  switch (status) {
    case "todo":
      return "bg-blue-100";
    case "in_progress":
      return "bg-yellow-100";
    case "done":
      return "bg-green-100";
  }
}

export default function ProjectDetail() {
  const columns = {
    todo: dummyProject.tasks.filter((t) => t.status === "todo"),
    in_progress: dummyProject.tasks.filter((t) => t.status === "in_progress"),
    done: dummyProject.tasks.filter((t) => t.status === "done"),
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold pb-2">{dummyProject.name}</h1>
          <p className="text-muted-foreground text-sm">
            Owned by {dummyProject.ownerName} · Created:{" "}
            {formatDate(dummyProject.createdAt)}
          </p>
          {dummyProject.description && (
            <p className="mt-2 text-sm text-muted-foreground max-w-xl">
              {dummyProject.description}
            </p>
          )}
          <div className="mt-2 flex items-center gap-4">
            <span className="text-sm">
              Total Tasks: <b>{dummyProject.tasks.length}</b>
            </span>
            <span className="text-sm">
              Done:{" "}
              <b>
                {dummyProject.tasks.filter((t) => t.status === "done").length}
              </b>{" "}
              (
              {(
                (dummyProject.tasks.filter((t) => t.status === "done").length /
                  dummyProject.tasks.length) *
                100
              ).toFixed(0)}
              %)
            </span>
          </div>
        </div>
        <Button asChild variant="outline" className="mt-4 md:mt-0">
          <Link
            href={`/projects/${encodeURIComponent(
              dummyProject.name.toLowerCase().replace(/\s+/g, "-")
            )}/settings`}
          >
            Project Settings
          </Link>
        </Button>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(["todo", "in_progress", "done"] as const).map((status) => (
          <div key={status} className="space-y-2">
            <Card className={`${getColumnStyle(status)} border-none`}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-md capitalize">
                  {status.replace("_", " ")}
                </CardTitle>
                <span className="text-xs font-normal text-muted-foreground">
                  {columns[status].length} task
                  {columns[status].length !== 1 ? "s" : ""}
                </span>
              </CardHeader>
            </Card>

            <ScrollArea className="h-[500px] p-2 bg-white">
              <div className="space-y-3">
                {columns[status].map((task) => (
                  <Card key={task.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{task.title}</CardTitle>
                      <CardDescription className="text-xs">
                        <span
                          className={`rounded px-2 py-0.5 text-xs font-medium ${getStatusColor(
                            task.status
                          )}`}
                        >
                          {task.status.replace("_", " ")}
                        </span>
                      </CardDescription>
                    </CardHeader>
                    {task.description && (
                      <CardContent className="text-sm text-muted-foreground">
                        {task.description}
                      </CardContent>
                    )}
                  </Card>
                ))}
                {columns[status].length === 0 && (
                  <p className="text-xs text-muted-foreground text-center mt-8">
                    No tasks
                  </p>
                )}
              </div>
            </ScrollArea>
          </div>
        ))}
      </div>
    </div>
  );
}
