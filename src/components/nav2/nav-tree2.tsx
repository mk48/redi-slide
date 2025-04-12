import React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import SlidesNav from "./slides-nav";

interface props {
  activeUrl: string;
  children: React.ReactNode;
}

const NavTree2: React.FC<props> = ({ activeUrl, children }) => {
  return (
    <div>
      <SidebarProvider defaultOpen={true}>
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>RediSchool</SidebarGroupLabel>
              <SidebarGroupContent>
                <SlidesNav activeUrl={activeUrl} />
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <main className="w-full">
          <SidebarTrigger className="text-transparent" />
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
};

export default NavTree2;
