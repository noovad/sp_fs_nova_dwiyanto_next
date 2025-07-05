"use client";

import { FolderKanban, LogOut } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarFooter,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/useAuthStore";
import { useProjectStore } from "@/app/store/useProjectStore";
import { useUserStore } from "@/app/store/useUserStore";
import { useEffect } from "react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { logout, loading } = useAuthStore();
  const { projects, getAllProjects } = useProjectStore();
  const { me, getMe } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      await getMe();
      await getAllProjects();
    };
    fetchData();
  }, [getAllProjects, getMe]);

  const ownedProjects = projects.filter(
    (project) => me?.id && project.ownerId === me.id
  );

  const memberProjects = projects.filter(
    (project) => me?.id && project.ownerId !== me.id
  );

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      router.push("/login");
    }
  };

  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <FolderKanban className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Project Management App</span>
                  <span className="">v1.0.0</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard" className="font-medium">
                  Dashboard
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {ownedProjects.length > 0 && (
              <>
                <SidebarSeparator className="bg-border h-0.5" />
                <span className="px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  My Projects ({ownedProjects.length})
                </span>
                {ownedProjects.map((project) => (
                  <SidebarMenuItem key={project.id}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={`/projects/${encodeURIComponent(
                          project.name.toLowerCase().replace(/\s+/g, "-")
                        )}`}
                      >
                        {project.name}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </>
            )}

            {memberProjects.length > 0 && (
              <>
                <SidebarSeparator className="bg-border h-0.5" />
                <span className="px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Shared Projects ({memberProjects.length})
                </span>
                {memberProjects.map((project) => (
                  <SidebarMenuItem key={project.id}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={`/projects/${encodeURIComponent(
                          project.name.toLowerCase().replace(/\s+/g, "-")
                        )}`}
                      >
                        {project.name}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </>
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {me && (
            <SidebarMenuItem>
              <div className="px-3 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{me.email}</span>
              </div>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} disabled={loading}>
              <LogOut className="size-4" />
              {loading ? "Logging out..." : "Logout"}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
