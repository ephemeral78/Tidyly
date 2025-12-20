import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Home,
  Calendar,
  BarChart3,
  Settings,
  Plus,
  Users,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { Room } from "@/types";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  rooms: Room[];
  selectedRoomId: string | null;
  onSelectRoom: (roomId: string | null) => void;
  onCreateRoom: () => void;
}

const navItems = [
  { title: "All Tasks", icon: Home, path: "/dashboard" },
  { title: "Calendar", icon: Calendar, path: "/dashboard/calendar" },
  { title: "Analytics", icon: BarChart3, path: "/dashboard/analytics" },
];

export function DashboardSidebar({
  rooms,
  selectedRoomId,
  onSelectRoom,
  onCreateRoom,
}: DashboardSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="p-4">
        <a href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <span className="text-primary-foreground font-bold">T</span>
          </div>
          {!collapsed && (
            <span className="font-semibold text-lg tracking-tight">Tidyly</span>
          )}
        </a>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={cn(collapsed && "sr-only")}>
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.path}
                    tooltip={item.title}
                  >
                    <NavLink to={item.path}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Rooms */}
        <SidebarGroup>
          <div className="flex items-center justify-between px-2">
            <SidebarGroupLabel className={cn(collapsed && "sr-only")}>
              Rooms
            </SidebarGroupLabel>
            {!collapsed && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={onCreateRoom}
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {rooms.map((room) => (
                <SidebarMenuItem key={room.id}>
                  <SidebarMenuButton
                    onClick={() => onSelectRoom(room.id)}
                    isActive={selectedRoomId === room.id}
                    tooltip={room.name}
                  >
                    <span className="text-base">{room.emoji}</span>
                    <span className="flex-1">{room.name}</span>
                    {!collapsed && (
                      <span className="text-xs text-muted-foreground">
                        {room.memberCount}
                      </span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {collapsed && (
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={onCreateRoom} tooltip="Add Room">
                    <Plus className="h-4 w-4" />
                    <span>Add Room</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Settings">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Sign out">
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
