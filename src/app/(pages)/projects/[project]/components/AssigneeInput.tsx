"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Project } from "@/dto/dtos";

interface AssigneeInputProps {
  project: Project;
  value: string;
  onChange: (assigneeId: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export function AssigneeInput({
  project,
  value,
  onChange,
  label = "Assignee",
  placeholder = "Type to search assignee...",
  required = false,
  className,
}: AssigneeInputProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const assignees = [
    { id: project.ownerId, email: project.owner?.email || "" },
    ...(project.memberships || [])
      .filter((member) => member.email)
      .map((member) => ({
        id: member.id,
        email: member.email,
      })),
  ].filter((assignee) => assignee.email);

  const selectedAssignee = assignees.find((a) => a.id === value);

  const filtered = assignees.filter((a) =>
    a.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (assigneeId: string) => {
    onChange(assigneeId);
    setOpen(false);
    setSearch("");
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Label>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Input
            value={selectedAssignee?.email ?? ""}
            onClick={() => setOpen(true)}
            readOnly
            placeholder={placeholder}
          />
        </PopoverTrigger>

        <PopoverContent className="p-0 w-[300px]" align="start">
          <Command>
            <CommandInput
              placeholder="Search assignee..."
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty>No assignee found.</CommandEmpty>
              <CommandGroup>
                {filtered.map((assignee) => (
                  <CommandItem
                    key={assignee.id}
                    value={assignee.email}
                    onSelect={() => handleSelect(assignee.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === assignee.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {assignee.email}
                    {assignee.id === project.ownerId && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        (Owner)
                      </span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
