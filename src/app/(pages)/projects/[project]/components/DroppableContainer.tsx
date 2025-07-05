import { useDroppable } from "@dnd-kit/core";

interface DroppableContainerProps {
  id: string;
  children: React.ReactNode;
}

export function DroppableContainer({ id, children }: DroppableContainerProps) {
  const { setNodeRef } = useDroppable({ id });
  return <div ref={setNodeRef}>{children}</div>;
}
