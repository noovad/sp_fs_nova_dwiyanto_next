"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { useProjectStore } from "@/app/store/useProjectStore";

type Member = {
  id: string;
  email: string;
};

export default function ProjectSettings() {
  const params = useParams();
  const router = useRouter();
  const {
    getProjectBySlug,
    updateProject,
    deleteProject,
    loading,
    currentProject,
  } = useProjectStore();

  const [projectName, setProjectName] = useState("");
  const [originalProjectName, setOriginalProjectName] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const hasChanges = projectName !== originalProjectName;

  useEffect(() => {
    const fetchProject = async () => {
      if (params.project) {
        const project = await getProjectBySlug(params.project as string);
        if (project) {
          setProjectName(project.name);
          setOriginalProjectName(project.name);
          setMembers(project.memberships || []);
        }
      }
    };

    fetchProject();
  }, [params.project, getProjectBySlug]);

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

  const handleSaveChanges = async () => {
    if (currentProject && hasChanges) {
      const updated = await updateProject(currentProject.id, {
        name: projectName,
      });
      if (updated) {
        setOriginalProjectName(projectName);
        const slug = encodeURIComponent(
          projectName.toLowerCase().replace(/\s+/g, "-")
        );
        router.push(`/projects/${slug}/settings`);
      }
    }
  };

  const handleDeleteProject = async () => {
    if (currentProject) {
      const success = await deleteProject(currentProject.id);
      if (success) {
        setShowDeleteConfirm(false);
        router.push("/dashboard");
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading project settings...</p>
        </div>
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Project not found</p>
        </div>
      </div>
    );
  }

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
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleSaveChanges}
            disabled={loading || !hasChanges || !projectName.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? "Saving..." : "Save Changes"}
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
                  <Button
                    variant="destructive"
                    onClick={handleDeleteProject}
                    disabled={loading}
                  >
                    {loading ? "Deleting..." : "Confirm Delete"}
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
