import { useMemo, useState } from "react";
import { FirestoreTask, FirestoreRoom } from "@/types/firestore";
import { TaskCard } from "./TaskCard";
import { TaskFilters, FilterStatus, FilterPriority, SortOption } from "./TaskFilters";
import { Button } from "@/components/ui/button";
import { Plus, Inbox } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TaskListProps {
  tasks: FirestoreTask[];
  rooms: FirestoreRoom[];
  selectedRoomId: string | null;
  onComplete: (taskId: string) => void;
  onEdit: (task: FirestoreTask) => void;
  onDelete: (taskId: string) => void;
  onCreateTask: () => void;
}

export function TaskList({
  tasks,
  rooms,
  selectedRoomId,
  onComplete,
  onEdit,
  onDelete,
  onCreateTask,
}: TaskListProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<FilterStatus>("all");
  const [priority, setPriority] = useState<FilterPriority>("all");
  const [sort, setSort] = useState<SortOption>("dueDate");

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);

  const filteredTasks = useMemo(() => {
    let result = tasks;

    // Filter by room
    if (selectedRoomId) {
      result = result.filter((t) => t.roomId === selectedRoomId);
    }

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(searchLower) ||
          t.assigneeName.toLowerCase().includes(searchLower)
      );
    }

    // Filter by status
    if (status === "active") {
      result = result.filter((t) => !t.completed);
    } else if (status === "completed") {
      result = result.filter((t) => t.completed);
    }

    // Filter by priority
    if (priority !== "all") {
      result = result.filter((t) => t.priority === priority);
    }

    // Sort
    result = [...result].sort((a, b) => {
      if (sort === "dueDate") {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (sort === "priority") {
        const priorityOrder = { P1: 0, P2: 1, P3: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // Move completed to bottom
    const active = result.filter((t) => !t.completed);
    const completed = result.filter((t) => t.completed);
    return [...active, ...completed];
  }, [tasks, selectedRoomId, search, status, priority, sort]);

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {selectedRoom ? (
                <>
                  <span className="mr-2">{selectedRoom.emoji}</span>
                  {selectedRoom.name}
                </>
              ) : (
                "All Tasks"
              )}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {filteredTasks.filter((t) => !t.completed).length} active tasks
            </p>
          </div>
          <Button onClick={onCreateTask}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>

        <TaskFilters
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
          priority={priority}
          onPriorityChange={setPriority}
          sort={sort}
          onSortChange={setSort}
        />
      </div>

      {/* Task List */}
      <div className="flex-1">
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Inbox className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-1">No tasks found</h3>
            <p className="text-muted-foreground text-sm mb-4">
              {search || status !== "all" || priority !== "all"
                ? "Try adjusting your filters"
                : "Create your first task to get started"}
            </p>
            {!search && status === "all" && priority === "all" && (
              <Button onClick={onCreateTask}>
                <Plus className="h-4 w-4 mr-2" />
                Create Task
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {filteredTasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <TaskCard
                    task={task}
                    onComplete={onComplete}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
