import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Bell, User, LogOut, Settings, UserCircle, UserPlus, QrCode, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationsDialog } from "@/components/social/NotificationsDialog";
import { AddFriendDialog } from "@/components/social/AddFriendDialog";
import { JoinRoomDialog } from "@/components/social/JoinRoomDialog";
import { MyCodesDialog } from "@/components/social/MyCodesDialog";
import { CreateRoomDialog } from "@/components/social/CreateRoomDialog";
import { useState, useEffect } from "react";
import { subscribeToFriendRequests, subscribeToRoomJoinRequests } from "@/lib/firestore";

interface DashboardHeaderProps {
  createRoomOpen?: boolean;
  joinRoomOpen?: boolean;
  onCreateRoomOpenChange?: (open: boolean) => void;
  onJoinRoomOpenChange?: (open: boolean) => void;
}

export function DashboardHeader({ 
  createRoomOpen: externalCreateRoomOpen,
  joinRoomOpen: externalJoinRoomOpen,
  onCreateRoomOpenChange,
  onJoinRoomOpenChange
}: DashboardHeaderProps = {}) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [addFriendOpen, setAddFriendOpen] = useState(false);
  const [internalJoinRoomOpen, setInternalJoinRoomOpen] = useState(false);
  const [myCodesOpen, setMyCodesOpen] = useState(false);
  const [internalCreateRoomOpen, setInternalCreateRoomOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  const joinRoomOpen = externalJoinRoomOpen ?? internalJoinRoomOpen;
  const createRoomOpen = externalCreateRoomOpen ?? internalCreateRoomOpen;

  const setJoinRoomOpen = (open: boolean) => {
    if (onJoinRoomOpenChange) {
      onJoinRoomOpenChange(open);
    } else {
      setInternalJoinRoomOpen(open);
    }
  };

  const setCreateRoomOpen = (open: boolean) => {
    if (onCreateRoomOpenChange) {
      onCreateRoomOpenChange(open);
    } else {
      setInternalCreateRoomOpen(open);
    }
  };

  useEffect(() => {
    if (!currentUser) return;

    const unsubFriend = subscribeToFriendRequests(currentUser.uid, (requests) => {
      setNotificationCount((prev) => {
        const friendCount = requests.length;
        return friendCount + (prev - (prev % 100)); // Keep room count
      });
    });

    const unsubRoom = subscribeToRoomJoinRequests(currentUser.uid, (requests) => {
      setNotificationCount((prev) => {
        const roomCount = requests.length;
        return (prev % 100) + roomCount; // Keep friend count
      });
    });

    return () => {
      unsubFriend();
      unsubRoom();
    };
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            onClick={() => setNotificationsOpen(true)}
          >
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
              >
                {notificationCount > 9 ? '9+' : notificationCount}
              </Badge>
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser?.photoURL || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials(currentUser?.displayName || currentUser?.email || null)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {currentUser?.displayName || 'User'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {currentUser?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setCreateRoomOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Room
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setMyCodesOpen(true)}>
                <QrCode className="mr-2 h-4 w-4" />
                My Friend Code
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setAddFriendOpen(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Friend
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setJoinRoomOpen(true)}>
                <UserCircle className="mr-2 h-4 w-4" />
                Join Room
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <NotificationsDialog 
        open={notificationsOpen} 
        onOpenChange={setNotificationsOpen}
      />
      <AddFriendDialog 
        open={addFriendOpen} 
        onOpenChange={setAddFriendOpen}
      />
      <JoinRoomDialog 
        open={joinRoomOpen} 
        onOpenChange={setJoinRoomOpen}
      />
      <MyCodesDialog 
        open={myCodesOpen} 
        onOpenChange={setMyCodesOpen}
      />
      <CreateRoomDialog 
        open={createRoomOpen} 
        onOpenChange={setCreateRoomOpen}
      />
    </>
  );
}
