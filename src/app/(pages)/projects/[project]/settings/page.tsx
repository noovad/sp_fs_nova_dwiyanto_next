"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2Icon } from "lucide-react";

type Member = {
  id: string;
  email: string;
};

type Project = {
  id: string;
  name: string;
  description: string;
  members: Member[];
};

const dummyProject: Project = {
  id: "1",
  name: "Website Redesign",
  description: "A revamp of the marketing site.",
  members: [
    { id: "u1", email: "alice@example.com" },
    { id: "u2", email: "bob@example.com" },
    { id: "u3", email: "charlie@example.com" },
  ],
};

export default function ProjectSettings() {
  const [projectName, setProjectName] = useState(dummyProject.name);
  const [projectDescription, setProjectDescription] = useState(
    dummyProject.description
  );
  const [members, setMembers] = useState(dummyProject.members);
  const [inviteEmail, setInviteEmail] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const removeMember = (id: string) => {
    setMembers(members.filter((member) => member.id !== id));
  };

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;

    const newMember: Member = {
      id: crypto.randomUUID(),
      email: inviteEmail.trim(),
    };

    setMembers([...members, newMember]);
    setInviteEmail("");
  };

  const handleSaveChanges = () => {
    console.log("Saving changes:", { projectName, projectDescription });
  };

  const handleDeleteProject = () => {
    alert("Project deleted");
    setShowDeleteConfirm(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Project Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your project configuration and team members
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="desc">Description</Label>
            <Input
              id="desc"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Enter project description"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleSaveChanges}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Save Changes
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team Members ({members.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-48">
            <div className="space-y-2">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex justify-between items-center p-3 border rounded-lg bg-gray-50"
                >
                  <span className="text-sm font-medium">{member.email}</span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeMember(member.id)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              {members.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground text-sm">
                    No members in this project yet.
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invite New Member</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter email address"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleInvite}
              className="bg-green-600 hover:bg-green-700"
            >
              Invite
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="pe-4">
              <p className="text-sm font-medium">Delete this project</p>
              <p className="text-sm text-muted-foreground">
                This action is irreversible. All data will be lost permanently.
              </p>
            </div>
            <Dialog
              open={showDeleteConfirm}
              onOpenChange={setShowDeleteConfirm}
            >
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2Icon className="mr-2 h-4 w-4" />
                  Delete Project
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Project</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-sm text-muted-foreground">
                    Are you sure you want to delete this project? This action
                    cannot be undone. All related tasks and team members will be
                    removed.
                  </p>
                </div>
                <DialogFooter className="gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDeleteProject}>
                    Confirm Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
