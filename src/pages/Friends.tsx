import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserProfile, getRoomTasks } from "@/lib/firestore";
import { FirestoreUser, FirestoreTask } from "@/types/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, UserCheck, ListTodo } from "lucide-react";
import { toast } from "sonner";

export default function Friends() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState<FirestoreUser[]>([]);
  const [friendTasks, setFriendTasks] = useState<Record<string, FirestoreTask[]>>({});

  useEffect(() => {
    loadFriendsAndTasks();
  }, [currentUser]);

  const loadFriendsAndTasks = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const userProfile = await getUserProfile(currentUser.uid);
      
      if (!userProfile || !userProfile.friends.length) {
        setFriends([]);
        setLoading(false);
        return;
      }

      // Load all friend profiles
      const friendProfiles = await Promise.all(
        userProfile.friends.map(friendId => getUserProfile(friendId))
      );
      const validFriends = friendProfiles.filter(f => f !== null) as FirestoreUser[];
      setFriends(validFriends);

      // Load tasks for each friend from shared rooms
      const tasksMap: Record<string, FirestoreTask[]> = {};
      
      for (const friend of validFriends) {
        // Find shared rooms
        const sharedRooms = userProfile.rooms.filter(roomId => 
          friend.rooms.includes(roomId)
        );

        // Get all tasks from shared rooms assigned to this friend
        const allTasks: FirestoreTask[] = [];
        for (const roomId of sharedRooms) {
          const roomTasks = await getRoomTasks(roomId);
          const friendTasks = roomTasks.filter(task => 
            task.assignees.includes(friend.uid) && !task.completed
          );
          allTasks.push(...friendTasks);
        }

        tasksMap[friend.uid] = allTasks;
      }

      setFriendTasks(tasksMap);
    } catch (error) {
      console.error("Error loading friends:", error);
      toast.error("Failed to load friends");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'P1': return 'destructive';
      case 'P2': return 'default';
      case 'P3': return 'secondary';
      case 'P4': return 'outline';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-3.5rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (friends.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-3.5rem)] gap-4">
        <UserCheck className="h-16 w-16 text-muted-foreground" />
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">No Friends Yet</h2>
          <p className="text-muted-foreground">
            Add friends using the "Add Friend" option in the menu
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Friends</h1>
        <p className="text-muted-foreground">View your friends and their pending tasks</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {friends.map((friend) => {
          const tasks = friendTasks[friend.uid] || [];
          const pendingCount = tasks.length;

          return (
            <Card key={friend.uid}>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={friend.photoURL || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(friend.displayName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{friend.displayName}</CardTitle>
                    <CardDescription className="truncate">{friend.email}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="tasks" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="tasks">
                      <ListTodo className="h-4 w-4 mr-2" />
                      Tasks ({pendingCount})
                    </TabsTrigger>
                    <TabsTrigger value="info">Info</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="tasks" className="space-y-2">
                    {tasks.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No pending tasks
                      </p>
                    ) : (
                      <ScrollArea className="h-[200px] w-full rounded-md border p-2">
                        <div className="space-y-2">
                          {tasks.map((task) => (
                            <div
                              key={task.id}
                              className="flex items-start gap-2 p-2 rounded-lg hover:bg-accent transition-colors"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{task.title}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  {task.priority && (
                                    <Badge variant={getPriorityColor(task.priority)} className="text-xs">
                                      {task.priority}
                                    </Badge>
                                  )}
                                  {task.points && (
                                    <Badge variant="outline" className="text-xs">
                                      {task.points} pts
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="info" className="space-y-2">
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Friend Code</span>
                        <span className="font-mono font-semibold">{friend.friendCode}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Shared Rooms</span>
                        <span className="font-semibold">
                          {friend.rooms.filter(r => currentUser && 
                            (async () => {
                              const userProfile = await getUserProfile(currentUser.uid);
                              return userProfile?.rooms.includes(r);
                            })()
                          ).length}
                        </span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">Pending Tasks</span>
                        <span className="font-semibold">{pendingCount}</span>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
