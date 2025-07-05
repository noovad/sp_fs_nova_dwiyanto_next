"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2 } from "lucide-react";
import { Project, Task } from "@/dto/dtos";
import { useTaskStore } from "@/app/store/useTaskStore";
import { getStatusColor } from "@/components/get-status-color";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AssigneeInput } from "./AssigneeInput";

interface TaskDetailDialogProps {
  task: Task | null;
  project: Project;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TaskDetailDialog({
  task,
  project,
  isOpen,
  onOpenChange,
}: TaskDetailDialogProps) {
  const { updateTask, deleteTask, loading } = useTaskStore();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Task["status"]>("todo");
  const [assigneeId, setAssigneeId] = useState("");
  const [currentTask, setCurrentTask] = useState<Task | null>(task);

  const assignees = [
    { id: project.ownerId, email: project.owner.email },
    ...(project.memberships || []).map((member) => ({
      id: member.id,
      email: member.email,
    })),
  ];

  useEffect(() => {
    if (task) {
      setCurrentTask(task);
      setTitle(task.title);
      setDescription(task.description || "");
      setStatus(task.status);
      setAssigneeId(task.assigneeId);
    }
  }, [task]);

  const handleSave = async () => {
    if (!currentTask || !title.trim()) return;

    const success = await updateTask(currentTask.id, {
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      assigneeId,
    });

    if (success) {
      const updatedTask = {
        ...currentTask,
        title: title.trim(),
        description: description.trim() || "",
        status,
        assigneeId,
        updatedAt: new Date().toISOString(),
      };
      setCurrentTask(updatedTask);
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (!currentTask) return;

    const success = await deleteTask(currentTask.id);
    if (success) {
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    if (currentTask) {
      setTitle(currentTask.title);
      setDescription(currentTask.description || "");
      setStatus(currentTask.status);
      setAssigneeId(currentTask.assigneeId);
    }
    setIsEditing(false);
  };

  useEffect(() => {
    if (isOpen) {
      setIsEditing(false);
    }
  }, [isOpen]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setIsEditing(false);
    }
    onOpenChange(open);
  };

  const getAssigneeEmail = (id: string) => {
    const assignee = assignees.find((a) => a.id === id);
    return assignee?.email || "Unknown";
  };

  const displayTask = currentTask || task;
  if (!displayTask) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Task Details</span>
            <div className="flex gap-2">
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={loading}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {isEditing ? (
            <>
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title *</Label>
                <Input
                  id="edit-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter task title"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter task description"
                  rows={3}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={status}
                  onValueChange={(value: Task["status"]) => setStatus(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To-do</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <AssigneeInput
                project={project}
                value={assigneeId}
                onChange={setAssigneeId}
                label="Assignee"
                required
              />
            </>
          ) : (
            <>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Title
                </Label>
                <p className="text-base font-medium mt-1">
                  {displayTask.title}
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Description
                </Label>
                <p className="text-sm mt-1 text-muted-foreground">
                  {displayTask.description || "No description provided"}
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Status
                </Label>
                <div className="mt-1">
                  <Badge
                    className={`${getStatusColor(
                      displayTask.status
                    )} border-none`}
                  >
                    {displayTask.status.replace("_", " ")}
                  </Badge>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Assignee
                </Label>
                <p className="text-sm mt-1">
                  {getAssigneeEmail(displayTask.assigneeId)}
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Created
                </Label>
                <p className="text-sm mt-1 text-muted-foreground">
                  {new Date(displayTask.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </>
          )}
        </div>

        {isEditing && (
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleCancel} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading || !title.trim()}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
