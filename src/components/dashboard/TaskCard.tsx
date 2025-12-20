import { Task } from "@/types";
import { cn } from "@/lib/utils";
import { Check, MoreHorizontal, Repeat, Clock, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format, isToday, isTomorrow, isPast, parseISO } from "date-fns";

interface TaskCardProps {
  task: Task;
  onComplete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const priorityColors = {
  P1: "bg-destructive/10 text-destructive border-destructive/20",
  P2: "bg-primary/10 text-primary border-primary/20",
  P3: "bg-muted text-muted-foreground border-border",
};

function formatDueDate(dateString: string): { text: string; isOverdue: boolean } {
  const date = parseISO(dateString);
  const isOverdue = isPast(date) && !isToday(date);
  
  if (isToday(date)) return { text: "Today", isOverdue: false };
  if (isTomorrow(date)) return { text: "Tomorrow", isOverdue: false };
  if (isOverdue) return { text: `Overdue · ${format(date, "MMM d")}`, isOverdue: true };
  return { text: format(date, "MMM d"), isOverdue: false };
}

export function TaskCard({ task, onComplete, onEdit, onDelete }: TaskCardProps) {
  const { text: dueText, isOverdue } = formatDueDate(task.dueDate);

  return (
    <div
      className={cn(
        "group flex items-center gap-4 p-4 rounded-xl border transition-all duration-200",
        task.completed
          ? "bg-muted/30 border-border opacity-60"
          : "bg-card border-border hover:border-primary/30 hover:shadow-sm"
      )}
    >
      {/* Complete button */}
      <button
        onClick={() => onComplete(task.id)}
        className={cn(
          "shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
          task.completed
            ? "bg-accent border-accent text-accent-foreground"
            : "border-muted-foreground/30 hover:border-accent hover:bg-accent/10"
        )}
      >
        {task.completed && <Check className="h-3.5 w-3.5" />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={cn(
              "font-medium truncate",
              task.completed && "line-through text-muted-foreground"
            )}
          >
            {task.title}
          </span>
          <span
            className={cn(
              "text-xs px-1.5 py-0.5 rounded border font-medium shrink-0",
              priorityColors[task.priority]
            )}
          >
            {task.priority}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>{task.assigneeName}</span>
          {task.repeat && (
            <span className="flex items-center gap-1">
              <Repeat className="h-3 w-3" />
              {task.repeat}
            </span>
          )}
        </div>
      </div>

      {/* Due date */}
      <div className="flex items-center gap-2 shrink-0">
        <span
          className={cn(
            "text-sm flex items-center gap-1.5",
            isOverdue && !task.completed ? "text-destructive font-medium" : "text-muted-foreground"
          )}
        >
          <Clock className="h-3.5 w-3.5" />
          {dueText}
        </span>
      </div>

      {/* Actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(task)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onDelete(task.id)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
