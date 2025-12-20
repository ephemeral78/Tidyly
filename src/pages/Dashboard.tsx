import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { TaskList } from "@/components/dashboard/TaskList";
import { CreateTaskDialog } from "@/components/dashboard/CreateTaskDialog";
import { ActivityPage } from "@/pages/Activity";
import { CalendarPage } from "@/pages/CalendarPage";
import { AnalyticsPage } from "@/pages/AnalyticsPage";
import { mockRooms, mockTasks, mockUsers } from "@/data/mockData";
import { Task } from "@/types";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { toast } = useToast();
  const [rooms] = useState(mockRooms);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  const handleCompleteTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              completed: !t.completed,
              completedAt: !t.completed ? new Date().toISOString() : undefined,
            }
          : t
      )
    );
    const task = tasks.find((t) => t.id === taskId);
    if (task && !task.completed) {
      toast({
        title: "Task completed!",
        description: `"${task.title}" marked as done.`,
      });
    }
  };

  const handleDeleteTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    toast({
      title: "Task deleted",
      description: `"${task?.title}" has been removed.`,
    });
  };

  const handleEditTask = (task: Task) => {
    setEditTask(task);
    setCreateDialogOpen(true);
  };

  const handleSaveTask = (
    taskData: Omit<Task, "id" | "createdAt" | "completed" | "completedAt">
  ) => {
    if (editTask) {
      // Update existing task
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editTask.id
            ? { ...t, ...taskData }
            : t
        )
      );
      toast({
        title: "Task updated",
        description: `"${taskData.title}" has been updated.`,
      });
    } else {
      // Create new task
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        completed: false,
      };
      setTasks((prev) => [newTask, ...prev]);
      toast({
        title: "Task created",
        description: `"${taskData.title}" has been added.`,
      });
    }
    setEditTask(null);
  };

  const handleCreateRoom = () => {
    toast({
      title: "Coming soon",
      description: "Room creation will be available when you connect to Lovable Cloud.",
    });
  };

  const handleOpenCreateDialog = () => {
    setEditTask(null);
    setCreateDialogOpen(true);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar
          rooms={rooms}
          selectedRoomId={selectedRoomId}
          onSelectRoom={setSelectedRoomId}
          onCreateRoom={handleCreateRoom}
        />

        <div className="flex-1 flex flex-col">
          <DashboardHeader />

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
                    users={mockUsers}
                  />
                }
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
                    users={mockUsers}
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
          users={mockUsers}
          editTask={editTask}
          defaultRoomId={selectedRoomId}
        />
      </div>
    </SidebarProvider>
  );
}
