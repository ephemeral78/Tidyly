import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  subscribeToFriendRequests,
  subscribeToRoomJoinRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  acceptRoomJoinRequest,
  rejectRoomJoinRequest,
} from '@/lib/firestore';
import { FriendRequest, RoomJoinRequest } from '@/types/firestore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Check, X, UserPlus, DoorOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotificationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotificationsDialog({ open, onOpenChange }: NotificationsDialogProps) {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [roomJoinRequests, setRoomJoinRequests] = useState<RoomJoinRequest[]>([]);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser || !open) return;

    const unsubFriendRequests = subscribeToFriendRequests(
      currentUser.uid,
      setFriendRequests
    );

    const unsubRoomRequests = subscribeToRoomJoinRequests(
      currentUser.uid,
      setRoomJoinRequests
    );

    return () => {
      unsubFriendRequests();
      unsubRoomRequests();
    };
  }, [currentUser, open]);

  const handleAcceptFriend = async (requestId: string, senderName: string) => {
    setLoading(requestId);
    try {
      await acceptFriendRequest(requestId);
      toast({
        title: 'Friend request accepted',
        description: `You are now friends with ${senderName}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to accept friend request',
        variant: 'destructive',
      });
    } finally {
      setLoading(null);
    }
  };

  const handleRejectFriend = async (requestId: string) => {
    setLoading(requestId);
    try {
      await rejectFriendRequest(requestId);
      toast({
        title: 'Request rejected',
        description: 'Friend request has been declined',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject friend request',
        variant: 'destructive',
      });
    } finally {
      setLoading(null);
    }
  };

  const handleAcceptRoom = async (requestId: string, userName: string, roomName: string) => {
    setLoading(requestId);
    try {
      await acceptRoomJoinRequest(requestId);
      toast({
        title: 'Request accepted',
        description: `${userName} has been added to ${roomName}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to accept join request',
        variant: 'destructive',
      });
    } finally {
      setLoading(null);
    }
  };

  const handleRejectRoom = async (requestId: string) => {
    setLoading(requestId);
    try {
      await rejectRoomJoinRequest(requestId);
      toast({
        title: 'Request rejected',
        description: 'Join request has been declined',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject join request',
        variant: 'destructive',
      });
    } finally {
      setLoading(null);
    }
  };

  const totalNotifications = friendRequests.length + roomJoinRequests.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Notifications
            {totalNotifications > 0 && (
              <Badge variant="destructive">{totalNotifications}</Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="friends" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="friends" className="relative">
              <UserPlus className="h-4 w-4 mr-2" />
              Friends
              {friendRequests.length > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                  {friendRequests.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="rooms" className="relative">
              <DoorOpen className="h-4 w-4 mr-2" />
              Rooms
              {roomJoinRequests.length > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                  {roomJoinRequests.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="friends" className="mt-4">
            <ScrollArea className="h-[400px] pr-4">
              {friendRequests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <UserPlus className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No pending friend requests</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {friendRequests.map((request) => (
                    <Card key={request.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {request.senderName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium">{request.senderName}</p>
                            <p className="text-sm text-muted-foreground truncate">
                              {request.senderEmail}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Wants to be your friend
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAcceptFriend(request.id, request.senderName)}
                              disabled={loading === request.id}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectFriend(request.id)}
                              disabled={loading === request.id}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="rooms" className="mt-4">
            <ScrollArea className="h-[400px] pr-4">
              {roomJoinRequests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <DoorOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No pending room requests</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {roomJoinRequests.map((request) => (
                    <Card key={request.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {request.userName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium">{request.userName}</p>
                            <p className="text-sm text-muted-foreground truncate">
                              {request.userEmail}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Wants to join <span className="font-medium">{request.roomName}</span>
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAcceptRoom(request.id, request.userName, request.roomName)}
                              disabled={loading === request.id}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectRoom(request.id)}
                              disabled={loading === request.id}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
