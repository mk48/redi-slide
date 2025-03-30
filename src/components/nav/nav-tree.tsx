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
import { moveNext, movePrevious } from "./util";

const slideNav: TreeLink[] = [
  { id: "1", title: "intro", url: "/arrays/01-intro" },
  { id: "2", title: "creating", url: "/arrays/02-creating" },
  { id: "3", title: "prop", url: "/arrays/03-prop" },
  { id: "4", title: "access", url: "/arrays/04-access-ele" },
  //{ id: "30", title: "parent", children: [{ id: "30.1", title: "ch 1", url: "/arrays/03-mdonly" }] },
];

interface props {
  activeUrl: string;
  children: React.ReactNode;
}

const NavTree: React.FC<props> = ({ activeUrl, children }) => {
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === " ") {
        event.preventDefault();
        const nextUrl = moveNext(activeUrl, slideNav);
        if (nextUrl) {
          window.location.href = nextUrl;
        }
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        const prevUrl = movePrevious(activeUrl, slideNav);
        if (prevUrl) {
          window.location.href = prevUrl;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div>
      <SidebarProvider defaultOpen={true}>
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>RediSchool</SidebarGroupLabel>
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
