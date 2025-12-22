import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
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
  SidebarMenuAction,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  Calendar,
  BarChart3,
  Settings,
  Plus,
  LogOut,
  Activity,
  UserCheck,
  Info,
  DoorOpen,
  PlusCircle,
} from "lucide-react";
import { FirestoreRoom } from "@/types/firestore";
import { cn } from "@/lib/utils";
import { RoomInfoDialog } from "@/components/social/RoomInfoDialog";

interface DashboardSidebarProps {
  rooms: FirestoreRoom[];
  selectedRoomId: string | null;
  onSelectRoom: (roomId: string | null) => void;
  onCreateRoom: () => void;
  onJoinRoom: () => void;
}

const navItems = [
  { title: "All Tasks", icon: Home, path: "/dashboard" },
  { title: "Activity", icon: Activity, path: "/dashboard/activity" },
  { title: "Friends", icon: UserCheck, path: "/dashboard/friends" },
  { title: "Calendar", icon: Calendar, path: "/dashboard/calendar" },
  { title: "Analytics", icon: BarChart3, path: "/dashboard/analytics" },
];

export function DashboardSidebar({
  rooms,
  selectedRoomId,
  onSelectRoom,
  onCreateRoom,
  onJoinRoom,
}: DashboardSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [roomInfoOpen, setRoomInfoOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<FirestoreRoom | null>(null);

  const handleRoomInfo = (room: FirestoreRoom, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedRoom(room);
    setRoomInfoOpen(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className={cn("p-4 transition-all", collapsed && "items-center px-2")}>
        <a href="/" className="flex items-center gap-3">
          <img src="/favicon.svg" alt="Tidyly" className="w-8 h-8 shrink-0" />
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
                      <item.icon className="shrink-0" />
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onCreateRoom}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Room
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onJoinRoom}>
                    <DoorOpen className="h-4 w-4 mr-2" />
                    Join Room
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
                    {/* Fixed-width span for emoji to match icon spacing */}
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center text-base">
                      {room.emoji}
                    </span>
                    <span className="truncate">{room.name}</span>
                    {!collapsed && (
                      <span className="ml-auto text-xs text-muted-foreground">
                        {room.members.length}
                      </span>
                    )}
                  </SidebarMenuButton>
                  
                  {/* Using SidebarMenuAction for the info icon */}
                  {!collapsed && (
                    <SidebarMenuAction 
                      onClick={(e) => handleRoomInfo(room, e)}
                      showOnHover
                    >
                      <Info />
                    </SidebarMenuAction>
                  )}
                </SidebarMenuItem>
              ))}
              
              {collapsed && (
                <SidebarMenuItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuButton tooltip="Add Room">
                        <Plus />
                        <span>Add Room</span>
                      </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" side="right">
                      <DropdownMenuItem onClick={onCreateRoom}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create Room
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={onJoinRoom}>
                        <DoorOpen className="h-4 w-4 mr-2" />
                        Join Room
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Sign out" onClick={handleLogout}>
              <LogOut />
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <RoomInfoDialog
        open={roomInfoOpen}
        onOpenChange={setRoomInfoOpen}
        room={selectedRoom}
      />
    </Sidebar>
  );
}
