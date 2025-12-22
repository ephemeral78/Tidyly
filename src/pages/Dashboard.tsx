import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { TaskList } from "@/components/dashboard/TaskList";
import { CreateTaskDialog } from "@/components/dashboard/CreateTaskDialog";
import { ActivityPage } from "@/pages/Activity";
import { CalendarPage } from "@/pages/CalendarPage";
import { AnalyticsPage } from "@/pages/AnalyticsPage";
import Friends from "@/pages/Friends";
import { useAuth } from "@/contexts/AuthContext";
import { subscribeToUserRooms, subscribeToRoomTasks, subscribeToMultipleRoomTasks, createTask, updateTask, deleteTask, getUserProfile } from "@/lib/firestore";
import { FirestoreRoom, FirestoreTask, FirestoreUser } from "@/types/firestore";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [rooms, setRooms] = useState<FirestoreRoom[]>([]);
  const [tasks, setTasks] = useState<FirestoreTask[]>([]);
  const [users, setUsers] = useState<FirestoreUser[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editTask, setEditTask] = useState<FirestoreTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [createRoomOpen, setCreateRoomOpen] = useState(false);
  const [joinRoomOpen, setJoinRoomOpen] = useState(false);

  // Subscribe to user's rooms
  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = subscribeToUserRooms(currentUser.uid, (userRooms) => {
      setRooms(userRooms);
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser]);

  // Subscribe to tasks from selected room or all rooms
  useEffect(() => {
    if (!currentUser || rooms.length === 0) return;

    if (selectedRoomId) {
      // Subscribe to tasks from selected room only
      const unsubscribe = subscribeToRoomTasks(selectedRoomId, (roomTasks) => {
        setTasks(roomTasks);
      });
      return unsubscribe;
    } else {
      // Subscribe to tasks from all rooms
      const roomIds = rooms.map(r => r.id);
      const unsubscribe = subscribeToMultipleRoomTasks(roomIds, (allTasks) => {
        setTasks(allTasks);
      });
      return unsubscribe;
    }
  }, [currentUser, rooms, selectedRoomId]);

  // Load all unique users from rooms
  useEffect(() => {
    const loadUsers = async () => {
      const uniqueUserIds = new Set<string>();
      rooms.forEach(room => {
        room.members.forEach(uid => uniqueUserIds.add(uid));
      });

      const userProfiles = await Promise.all(
        Array.from(uniqueUserIds).map(uid => getUserProfile(uid))
      );
      const validUsers = userProfiles.filter(u => u !== null) as FirestoreUser[];
      setUsers(validUsers);
    };

    if (rooms.length > 0) {
      loadUsers();
    }
  }, [rooms]);

  const handleCompleteTask = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    try {
      await updateTask(taskId, {
        completed: !task.completed,
        completedAt: !task.completed ? new Date().toISOString() : "",
      });

      if (!task.completed) {
        toast({
          title: "Task completed!",
          description: `"${task.title}" marked as done.`,
        });
      }
    } catch (error) {
      console.error("Error updating task:", error);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    try {
      await deleteTask(taskId);
      toast({
        title: "Task deleted",
        description: `"${task.title}" has been removed.`,
      });
    } catch (error) {
      console.error("Error deleting task:", error);
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    }
  };
  const handleEditTask = (task: FirestoreTask) => {
    setEditTask(task);
    setCreateDialogOpen(true);
  };

  const handleSaveTask = async (taskData: Partial<FirestoreTask>) => {
    if (!currentUser) return;

    try {
      // Remove undefined values (Firestore doesn't accept them)
      const cleanedData = Object.fromEntries(
        Object.entries(taskData).filter(([_, v]) => v !== undefined)
      );

      if (editTask) {
        // Update existing task
        await updateTask(editTask.id, cleanedData);
        toast({
          title: "Task updated",
          description: `"${taskData.title}" has been updated.`,
        });
      } else {
        // Create new task
        const roomId = selectedRoomId || rooms[0]?.id;
        if (!roomId) {
          toast({
            title: "Error",
            description: "Please select or create a room first",
            variant: "destructive",
          });
          return;
        }

        await createTask({
          ...cleanedData as any,
          roomId,
          createdBy: currentUser.uid,
          completed: false,
          completedAt: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        toast({
          title: "Task created",
          description: `"${taskData.title}" has been added.`,
        });
      }
      setEditTask(null);
    } catch (error) {
      console.error("Error saving task:", error);
      toast({
        title: "Error",
        description: "Failed to save task",
        variant: "destructive",
      });
    }
  };

  const handleCreateRoom = () => {
    setCreateRoomOpen(true);
  };

  const handleJoinRoom = () => {
    setJoinRoomOpen(true);
  };

  const handleOpenCreateDialog = () => {
    setEditTask(null);
    setCreateDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar
          rooms={rooms}
          selectedRoomId={selectedRoomId}
          onSelectRoom={setSelectedRoomId}
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
        />

        <div className="flex-1 flex flex-col">
          <DashboardHeader 
            createRoomOpen={createRoomOpen}
            joinRoomOpen={joinRoomOpen}
            onCreateRoomOpenChange={setCreateRoomOpen}
            onJoinRoomOpenChange={setJoinRoomOpen}
          />

          <main className="flex-1 p-6">
            <Routes>
              <Route
                path="/"
                element={
                  <TaskList
                    tasks={tasks.filter((t) => !t.completed)}
                    rooms={rooms}
                    selectedRoomId={selectedRoomId}
                    onComplete={handleCompleteTask}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                    onCreateTask={handleOpenCreateDialog}
                  />
                }
              />
              <Route
                path="/activity"
                element={
                  <ActivityPage
                    tasks={tasks}
                    rooms={rooms}
                    users={users}
                  />
                }
              />
              <Route
                path="/friends"
                element={<Friends />}
              />
              <Route
                path="/calendar"
                element={
                  <CalendarPage
                    tasks={tasks}
                    rooms={rooms}
                  />
                }
              />
              <Route
                path="/analytics"
                element={
                  <AnalyticsPage
                    tasks={tasks}
                    rooms={rooms}
                    users={users}
                  />
                }
              />
            </Routes>
          </main>
        </div>

        <CreateTaskDialog
          open={createDialogOpen}
          onOpenChange={(open) => {
            setCreateDialogOpen(open);
            if (!open) setEditTask(null);
          }}
          onSave={handleSaveTask}
          rooms={rooms}
          users={users}
          editTask={editTask}
          defaultRoomId={selectedRoomId}
        />
      </div>
    </SidebarProvider>
  );
}
