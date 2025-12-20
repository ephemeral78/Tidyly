import { useState } from "react";
import { FirestoreTask, FirestoreRoom, FirestoreUser } from "@/types/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, CheckCircle2, Clock, User as UserIcon } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

interface ActivityPageProps {
  tasks: FirestoreTask[];
  rooms: FirestoreRoom[];
  users: FirestoreUser[];
}

export function ActivityPage({ tasks, rooms, users }: ActivityPageProps) {
  const [filterRoom, setFilterRoom] = useState<string>("all");
  const [filterUser, setFilterUser] = useState<string>("all");

  const completedTasks = tasks.filter((task) => task.completed);

  const filteredTasks = completedTasks.filter((task) => {
    const matchesRoom = filterRoom === "all" || task.roomId === filterRoom;
    const matchesUser = filterUser === "all" || task.assigneeId === filterUser;
    return matchesRoom && matchesUser;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const dateA = new Date(a.completedAt || a.createdAt).getTime();
    const dateB = new Date(b.completedAt || b.createdAt).getTime();
    return dateB - dateA; // Most recent first
  });

  const getRoomName = (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId);
    return room ? `${room.emoji} ${room.name}` : "Unknown";
  };

  const getPriorityColor = (priority: FirestoreTask["priority"]) => {
    switch (priority) {
      case "P1":
        return "destructive";
      case "P2":
        return "default";
      case "P3":
        return "secondary";
      case "P4":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Activity</h1>
        <p className="text-muted-foreground">View all completed tasks and track progress</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={filterRoom} onValueChange={setFilterRoom}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by room" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Rooms</SelectItem>
            {rooms.map((room) => (
              <SelectItem key={room.id} value={room.id}>
                {room.emoji} {room.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterUser} onValueChange={setFilterUser}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by user" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            {users.map((user) => (
              <SelectItem key={user.uid} value={user.uid}>
                {user.displayName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-md">
          <span className="text-sm font-medium">{sortedTasks.length}</span>
          <span className="text-sm text-muted-foreground">completed tasks</span>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {sortedTasks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No completed tasks yet</p>
              <p className="text-sm text-muted-foreground">
                Completed tasks will appear here
              </p>
            </CardContent>
          </Card>
        ) : (
          sortedTasks.map((task) => (
            <Card key={task.id} className="hover:bg-muted/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="font-medium line-through text-muted-foreground">
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {task.description}
                          </p>
                        )}
                      </div>
                      {task.priority && (
                        <Badge variant={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <UserIcon className="h-4 w-4" />
                        <span>{task.assigneeName}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-xs">📍</span>
                        <span>{getRoomName(task.roomId)}</span>
                      </div>

                      {task.completedAt && (
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          <span>
                            Completed {formatDistanceToNow(new Date(task.completedAt), { addSuffix: true })}
                          </span>
                        </div>
                      )}

                      {task.points && (
                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">
                          +{task.points} points
                        </Badge>
                      )}
                    </div>

                    {task.labels && task.labels.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {task.labels.map((label) => (
                          <Badge key={label.id} variant="secondary" className="text-xs">
                            {label.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
