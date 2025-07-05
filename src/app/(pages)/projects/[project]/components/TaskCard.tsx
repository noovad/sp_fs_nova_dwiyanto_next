import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Task } from "@/dto/dtos";
import { getStatusColor } from "@/components/get-status-color";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
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
