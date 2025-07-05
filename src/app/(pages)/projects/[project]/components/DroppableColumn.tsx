import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Task } from "@/dto/dtos";
import { TaskCard } from "./TaskCard";

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

interface DroppableColumnProps {
  status: Task["status"];
  tasks: Task[];
  title: string;
  count: number;
}

export function DroppableColumn({
  status,
  tasks,
  title,
  count,
}: DroppableColumnProps) {
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
