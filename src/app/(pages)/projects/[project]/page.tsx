"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Task } from "@/dto/dtos";
import { DroppableColumn } from "./components/DroppableColumn";
import { DroppableContainer } from "./components/DroppableContainer";
import { ProjectHeader } from "./components/ProjectHeader";
import { useProjectStore } from "@/app/store/useProjectStore";
import { getStatusColor } from "@/components/get-status-color";

export default function ProjectDetail() {
  const params = useParams();
  const { getProjectBySlug, loading, currentProject } = useProjectStore();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    const fetchProject = async () => {
      if (params.project) {
        const project = await getProjectBySlug(params.project as string);
        if (project) {
          setTasks(project.tasks);
        }
      }
    };

    fetchProject();
  }, [params.project, getProjectBySlug]);

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

    const updatedTasks = [...tasks].filter((t) => t.id !== active.id);
    const overIndex = updatedTasks.findIndex((t) => t.id === over.id);
    const newTask = { ...activeTask, status: newStatus };

    if (isDroppingOnColumn || overIndex === -1) {
      updatedTasks.push(newTask);
    } else {
      updatedTasks.splice(overIndex, 0, newTask);
    }

    setTasks(updatedTasks);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Project not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 w-full mx-auto">
      <ProjectHeader
        project={currentProject}
        tasks={tasks}
        projectSlug={params.project as string}
      />

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
