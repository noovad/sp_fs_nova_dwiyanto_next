import { io, Socket } from "socket.io-client";
import { useProjectStore } from "@/app/store/useProjectStore";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

let socket: Socket | null = null;

export const initSocket = (): Socket => {
  if (!socket || !socket.connected) {
    const projectId = useProjectStore.getState().currentProject?.id;

    if (!projectId) throw new Error("Project ID is required for socket connection");

    socket = io(SOCKET_URL, {
      withCredentials: true,
      query: {
        projectId,
      },
    });

    socket.off("connect");
    socket.off("disconnect");
    socket.off("connect_error");

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket?.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });
  }

  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
