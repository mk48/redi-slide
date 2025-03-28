import React from "react";
import type { TreeLink } from "./types";
import NavItem from "./nav-item";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Collapsible } from "@/components/ui/collapsible";

const slideNav: TreeLink[] = [
  { id: "1", title: "intro", url: "/arrays/01-intro" },
  { id: "2", title: "creating", url: "/arrays/02-creating" },
  { id: "3", title: "parent", children: [{ id: "3.1", title: "ch 1", url: "/arrays/03-mdonly" }] },
];

interface props {
  children: React.ReactNode;
}

const NavTree: React.FC<props> = ({ children }) => {
  return (
    <div>
      <SidebarProvider defaultOpen={false}>
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Application</SidebarGroupLabel>
              <SidebarGroupContent>
                <NavItem nav={slideNav} />
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <main>
          <SidebarTrigger className="text-transparent" />
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
};

export default NavTree;
