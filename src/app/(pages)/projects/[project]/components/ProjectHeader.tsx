import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Project, Task } from "@/dto/dtos";
import { formatDate } from "@/lib/date";

interface ProjectHeaderProps {
  project: Project;
  tasks: Task[];
  projectSlug: string;
}

export function ProjectHeader({
  project,
  tasks,
  projectSlug,
}: ProjectHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
      <div>
        <h1 className="text-3xl font-bold pb-2">{project.name}</h1>
        <p className="text-muted-foreground text-sm">
          Owned by {project.owner.email} · Created:{" "}
          {formatDate(project.createdAt)}
        </p>
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
        <Link href={`/projects/${projectSlug}/settings`}>Project Settings</Link>
      </Button>
    </div>
  );
}
