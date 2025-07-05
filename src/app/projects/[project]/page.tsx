"use client";

import { useState } from "react";
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
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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

function TaskCard({ task }: { task: Task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
    >
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
  );
}

function DroppableContainer({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({ id });
  return <div ref={setNodeRef}>{children}</div>;
}

function DroppableColumn({
  status,
  tasks,
  title,
  count,
}: {
  status: Task["status"];
  tasks: Task[];
  title: string;
  count: number;
}) {
  return (
    <div className="space-y-2">
      <Card className={`${getColumnStyle(status)} border-none`}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-md capitalize">{title}</CardTitle>
          <span className="text-xs font-normal text-muted-foreground">
            {count} task{count !== 1 ? "s" : ""}
          </span>
        </CardHeader>
      </Card>

      <ScrollArea className="h-[500px] p-2 bg-white rounded-lg">
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3 min-h-[400px]">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
            {tasks.length === 0 && (
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center h-32 flex items-center justify-center">
                <p className="text-xs text-muted-foreground">Drop tasks here</p>
              </div>
            )}
          </div>
        </SortableContext>
      </ScrollArea>
    </div>
  );
}

export default function ProjectDetail() {
  const [tasks, setTasks] = useState<Task[]>(dummyProject.tasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const columns = {
    todo: tasks.filter((t) => t.status === "todo"),
    in_progress: tasks.filter((t) => t.status === "in_progress"),
    done: tasks.filter((t) => t.status === "done"),
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over || active.id === over.id) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    const overTask = tasks.find((t) => t.id === over.id);
    if (!activeTask) return;

    const isDroppingOnColumn =
      over.id === "todo" || over.id === "in_progress" || over.id === "done";

    const newStatus = isDroppingOnColumn
      ? (over.id as Task["status"])
      : overTask?.status ?? activeTask.status;

    // Remove the active task from the current position
    const updatedTasks = [...tasks].filter((t) => t.id !== active.id);

    // Find the index where we want to insert the task
    const overIndex = updatedTasks.findIndex((t) => t.id === over.id);

    const newTask = { ...activeTask, status: newStatus };

    if (isDroppingOnColumn || overIndex === -1) {
      // Drop at the end of the column
      updatedTasks.push(newTask);
    } else {
      // Insert at the specific position
      updatedTasks.splice(overIndex, 0, newTask);
    }

    setTasks(updatedTasks);
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
              Total Tasks: <b>{tasks.length}</b>
            </span>
            <span className="text-sm">
              Done: <b>{tasks.filter((t) => t.status === "done").length}</b> (
              {tasks.length > 0
                ? (
                    (tasks.filter((t) => t.status === "done").length /
                      tasks.length) *
                    100
                  ).toFixed(0)
                : 0}
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

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DroppableContainer id="todo">
            <DroppableColumn
              status="todo"
              tasks={columns.todo}
              title="To do"
              count={columns.todo.length}
            />
          </DroppableContainer>
          <DroppableContainer id="in_progress">
            <DroppableColumn
              status="in_progress"
              tasks={columns.in_progress}
              title="In Progress"
              count={columns.in_progress.length}
            />
          </DroppableContainer>
          <DroppableContainer id="done">
            <DroppableColumn
              status="done"
              tasks={columns.done}
              title="Done"
              count={columns.done.length}
            />
          </DroppableContainer>
        </div>

        <DragOverlay>
          {activeTask ? (
            <Card className="cursor-grabbing shadow-lg rotate-3">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{activeTask.title}</CardTitle>
                <CardDescription className="text-xs">
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-medium ${getStatusColor(
                      activeTask.status
                    )}`}
                  >
                    {activeTask.status.replace("_", " ")}
                  </span>
                </CardDescription>
              </CardHeader>
              {activeTask.description && (
                <CardContent className="text-sm text-muted-foreground">
                  {activeTask.description}
                </CardContent>
              )}
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
