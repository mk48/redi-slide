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
  {
    id: "5",
    title: "basic array methods",
    children: [
      { id: "5.1", title: "push() and pop()", url: "/arrays/methods/push-pop" },
      { id: "5.2", title: "unshift() and shift()", url: "/arrays/methods/unshift-shift" },
      { id: "5.3", title: "concat()", url: "/arrays/methods/concat" },
      { id: "5.4", title: "slice()", url: "/arrays/methods/slice" },
      { id: "5.5", title: "indexOf() and includes()", url: "/arrays/methods/indexOf-includes" },
      { id: "5.6", title: "join()", url: "/arrays/methods/join" },
    ],
  },
  { id: "6", title: "passing-func", url: "/arrays/05-passing-fun" },
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
