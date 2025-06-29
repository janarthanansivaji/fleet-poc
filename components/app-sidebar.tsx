"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  CarIcon,
  Command,
  Frame,
  GalleryVerticalEnd,
  LocateIcon,
  Map,
  PieChart,
  Sailboat,
  Settings2,
  SquareTerminal,
} from "lucide-react";
import Image from "next/image";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "Varadharajan Ramu",
    email: "ramu.varadharajan@srmtech.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "LogiTrack",
      logo: Sailboat,
      plan: "",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="bg-slate-900 mb-10">
        <SidebarMenu>
          <SidebarMenuItem  >
           <a href="https://www.srmtech.com/who-we-are/" target="_blank">
           <Image
              src="https://www.srmtech.com/wp-content/uploads/2025/01/logo_srm_white.png"
              alt="SRM Tech Logo"
              width={120}
              height={60}
            />
           </a>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton title="Vehicles" asChild>
              <a href="vehicles">
                <CarIcon />
                {mounted && !isCollapsed && <span>Vehicles</span>}
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="geo-fencing">
                <LocateIcon />
                {mounted && !isCollapsed && <span>Geo fencing</span>}
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
