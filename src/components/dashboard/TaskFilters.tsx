import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, SlidersHorizontal } from "lucide-react";

export type FilterStatus = "all" | "active" | "completed";
export type FilterPriority = "all" | "P1" | "P2" | "P3";
export type SortOption = "dueDate" | "priority" | "created";

interface TaskFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: FilterStatus;
  onStatusChange: (value: FilterStatus) => void;
  priority: FilterPriority;
  onPriorityChange: (value: FilterPriority) => void;
  sort: SortOption;
  onSortChange: (value: SortOption) => void;
}

export function TaskFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  sort,
  onSortChange,
}: TaskFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">

        <Select value={priority} onValueChange={(v) => onPriorityChange(v as FilterPriority)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priorities</SelectItem>
            <SelectItem value="P1">P1 - High</SelectItem>
            <SelectItem value="P2">P2 - Medium</SelectItem>
            <SelectItem value="P3">P3 - Low</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={(v) => onSortChange(v as SortOption)}>
          <SelectTrigger className="w-[130px]">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dueDate">Due date</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="created">Created</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
