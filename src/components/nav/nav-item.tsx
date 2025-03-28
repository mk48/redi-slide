import { useState } from "react";
import type { TreeLink } from "./types";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

interface props {
  nav: TreeLink[];
}

const NavItem: React.FC<props> = ({ nav }) => {
  return (
    <SidebarMenuSub>
      {nav.map((item) => {
        if ((item.children?.length ?? 0) > 0) {
          return (
            <SidebarMenuSubItem key={item.id}>
              <Collapsible defaultOpen={true}>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <NavItem nav={item.children!} />
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenuSubItem>
          );
        }

        return (
          <SidebarMenuSubItem key={item.id}>
            <SidebarMenuButton tooltip={item.title}>
              <a href={item.url} key={item.id}>
                {item.title}
              </a>
            </SidebarMenuButton>
          </SidebarMenuSubItem>
        );
      })}
    </SidebarMenuSub>
  );
};

export default NavItem;
