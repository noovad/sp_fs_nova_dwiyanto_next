import { Task } from "@/dto/dtos";

export function getStatusColor(status: Task["status"]) {
  switch (status) {
    case "todo":
      return "bg-blue-100 text-blue-800";
    case "in_progress":
      return "bg-yellow-100 text-yellow-800";
    case "done":
      return "bg-green-100 text-green-800";
  }
}
