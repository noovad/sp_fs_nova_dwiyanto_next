/* eslint-disable react-hooks/exhaustive-deps */
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
import { useTaskStore } from "@/app/store/useTaskStore";
import { getStatusColor } from "@/components/get-status-color";
import { CreateTaskDialog } from "./components/CreateTaskDialog";
import { TaskDetailDialog } from "./components/TaskDetailDialog";
import { useUserStore } from "@/app/store/useUserStore";

export default function ProjectDetail() {
  const params = useParams();
  const getProjectBySlug = useProjectStore((state) => state.getProjectBySlug);
  const currentProject = useProjectStore((state) => state.currentProject);
  const getAllTasks = useTaskStore((state) => state.getAllTasks);
  const tasks = useTaskStore((state) => state.tasks);
  const updateTask = useTaskStore((state) => state.updateTask);
  const updateLocalTask = useTaskStore((state) => state.updateLocalTask);
  const me = useUserStore((state) => state.me);
  const getMe = useUserStore((state) => state.getMe);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    const fetchData = async () => {
      if (params.project) {
        const project = await getProjectBySlug(params.project as string);
        if (project) {
          await getAllTasks(project.id);
        }
      }

      if (!me) {
        await getMe();
      }
    };

    fetchData();
  }, [params.project]);

  const settingVisibility =
    me && currentProject && me.id === currentProject.ownerId ? true : false;

  const columns = {
    todo: tasks.filter((t) => t.status === "todo"),
    in_progress: tasks.filter((t) => t.status === "in_progress"),
    done: tasks.filter((t) => t.status === "done"),
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
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

    if (activeTask.status !== newStatus) {
      updateLocalTask(activeTask.id, { status: newStatus });

      const success = await updateTask(activeTask.id, { status: newStatus });

      if (!success) {
        updateLocalTask(activeTask.id, { status: activeTask.status });
      }
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskDialogOpen(true);
  };

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
        settingVisibility={settingVisibility}
      />

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <CreateTaskDialog project={currentProject} />
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
              onTaskClick={handleTaskClick}
            />
          </DroppableContainer>
          <DroppableContainer id="in_progress">
            <DroppableColumn
              status="in_progress"
              tasks={columns.in_progress}
              title="In Progress"
              count={columns.in_progress.length}
              onTaskClick={handleTaskClick}
            />
          </DroppableContainer>
          <DroppableContainer id="done">
            <DroppableColumn
              status="done"
              tasks={columns.done}
              title="Done"
              count={columns.done.length}
              onTaskClick={handleTaskClick}
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

      <TaskDetailDialog
        task={selectedTask}
        project={currentProject}
        isOpen={isTaskDialogOpen}
        onOpenChange={setIsTaskDialogOpen}
      />
    </div>
  );
}
