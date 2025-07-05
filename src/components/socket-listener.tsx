"use client";
import { initSocket } from "@/lib/socket";
import { useEffect } from "react";
import { useTaskStore } from "@/app/store/useTaskStore";
import { useProjectStore } from "@/app/store/useProjectStore";
import { useProjectMemberStore } from "@/app/store/useProjectMemberStore";

export default function SocketListener() {
  useEffect(() => {
    const socket = initSocket();

    socket.on("task:created", () => {
      const { getAllTasks } = useTaskStore.getState();
      const currentProject = useProjectStore.getState().currentProject;
      if (currentProject?.id) getAllTasks(currentProject.id);
    });

    socket.on("task:updated", () => {
      const { getAllTasks } = useTaskStore.getState();
      const currentProject = useProjectStore.getState().currentProject;
      if (currentProject?.id) getAllTasks(currentProject.id);
    });

    socket.on("task:deleted", () => {
      const { getAllTasks } = useTaskStore.getState();
      const currentProject = useProjectStore.getState().currentProject;
      if (currentProject?.id) getAllTasks(currentProject.id);
    });

    socket.on("project:updated", () => {
      const { getAllProjects } = useProjectStore.getState();
      getAllProjects();
    });

    socket.on("project:deleted", () => {
      const { getAllProjects } = useProjectStore.getState();
      getAllProjects();
    });

    socket.on("projectMember:created", () => {
      const { getAllProjectMembers } = useProjectMemberStore.getState();
      const currentProject = useProjectStore.getState().currentProject;
      if (currentProject?.id) getAllProjectMembers(currentProject.id);

      const { getAllProjects } = useProjectStore.getState();
      getAllProjects();
    });

    socket.on("projectMember:deleted", () => {
      const { getAllProjectMembers } = useProjectMemberStore.getState();
      const currentProject = useProjectStore.getState().currentProject;
      if (currentProject?.id) getAllProjectMembers(currentProject.id);

      const { getAllProjects } = useProjectStore.getState();
      getAllProjects();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return null;
}
