"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Plus } from "lucide-react";
import { Project, Task } from "@/dto/dtos";
import { toast } from "sonner";
import { useTaskStore } from "@/app/store/useTaskStore";
import { AssigneeInput } from "./AssigneeInput";

interface CreateTaskDialogProps {
  project: Project;
}

export function CreateTaskDialog({ project }: CreateTaskDialogProps) {
  const createTask = useTaskStore((state) => state.createTask);
  const loading = useTaskStore((state) => state.loading);
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Task["status"]>("todo");
  const [assigneeId, setAssigneeId] = useState("");

  const handleSubmit = async () => {
    if (!title.trim() || !assigneeId) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newTask = await createTask({
      projectId: project.id,
      title: title.trim(),
      assigneeId,
      status,
      description: description.trim() || undefined,
    });

    if (newTask) {
      setTitle("");
      setDescription("");
      setStatus("todo");
      setAssigneeId("");
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="task-title">Title *</Label>
            <Input
              id="task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="task-description">Description</Label>
            <Textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description (optional)"
              rows={3}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="task-status">Status</Label>
            <Select
              value={status}
              onValueChange={(value: Task["status"]) => setStatus(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
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
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !title.trim() || !assigneeId}
          >
            {loading ? "Creating..." : "Create Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
