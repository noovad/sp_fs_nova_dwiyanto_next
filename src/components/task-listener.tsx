"use client";

import { disconnectSocket, initSocket } from "@/lib/socket";
import { useEffect } from "react";
import { useTaskStore } from "@/app/store/useTaskStore";
import { useProjectStore } from "@/app/store/useProjectStore";

export default function TaskListener() {
  useEffect(() => {
    const socket = initSocket();

    const refresh = () => {
      const { getAllTasks } = useTaskStore.getState();
      const project = useProjectStore.getState().currentProject;
      if (project?.id) getAllTasks(project.id);
    };

    socket.on("task:created", refresh);
    socket.on("task:updated", refresh);
    socket.on("task:deleted", refresh);

    return () => {
      socket.off("task:created", refresh);
      socket.off("task:updated", refresh);
      socket.off("task:deleted", refresh);
      disconnectSocket();
    };
  }, []);

  return null;
}
