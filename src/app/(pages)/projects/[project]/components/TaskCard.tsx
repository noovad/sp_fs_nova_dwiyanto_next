import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Task } from "@/dto/dtos";
import { getStatusColor } from "@/components/get-status-color";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onTaskClick?: (task: Task) => void;
}

export function TaskCard({ task, onTaskClick }: TaskCardProps) {
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

  const handleClick = (e: React.MouseEvent) => {
    if (onTaskClick && !isDragging) {
      e.stopPropagation();
      onTaskClick(task);
    }
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
      onClick={handleClick}
    >
      <CardHeader className="pb-3 pt-3">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-sm font-medium leading-tight line-clamp-2">
              {task.title}
            </CardTitle>
            <span
              className={cn(
                "rounded-full px-2 py-1 text-xs font-medium shrink-0",
                getStatusColor(task.status)
              )}
            >
              {task.status.replace("_", " ")}
            </span>
          </div>

          {task.assignee?.email && (
            <CardDescription className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span className="truncate">{task.assignee.email}</span>
            </CardDescription>
          )}
        </div>
      </CardHeader>
    </Card>
  );
}
