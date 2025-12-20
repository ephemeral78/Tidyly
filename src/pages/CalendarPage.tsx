import { useState, useMemo } from "react";
import { Calendar as BigCalendar, dateFnsLocalizer, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { Task, Room } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./CalendarPage.css";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarPageProps {
  tasks: Task[];
  rooms: Room[];
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Task;
}

export function CalendarPage({ tasks, rooms }: CalendarPageProps) {
  const [view, setView] = useState<View>("month");
  const [date, setDate] = useState(new Date());
  const [filterRoom, setFilterRoom] = useState<string>("all");

  const filteredTasks = tasks.filter((task) => {
    if (filterRoom === "all") return true;
    return task.roomId === filterRoom;
  });

  const events: CalendarEvent[] = useMemo(() => {
    return filteredTasks.map((task) => {
      const dueDate = new Date(task.dueDate);
      return {
        id: task.id,
        title: task.title,
        start: dueDate,
        end: dueDate,
        resource: task,
      };
    });
  }, [filteredTasks]);

  const eventStyleGetter = (event: CalendarEvent) => {
    const task = event.resource;
    let backgroundColor = "#3b82f6"; // Default blue

    if (task.completed) {
      backgroundColor = "#10b981"; // Green for completed
    } else if (task.priority === "P1") {
      backgroundColor = "#ef4444"; // Red for high priority
    } else if (task.priority === "P2") {
      backgroundColor = "#f59e0b"; // Orange for medium priority
    } else if (task.priority === "P3") {
      backgroundColor = "#8b5cf6"; // Purple for low priority
    }

    return {
      style: {
        backgroundColor,
        borderRadius: "4px",
        opacity: task.completed ? 0.7 : 1,
        color: "white",
        border: "none",
        display: "block",
      },
    };
  };

  const EventComponent = ({ event }: { event: CalendarEvent }) => {
    const task = event.resource;
    return (
      <div className="text-xs">
        <div className="font-medium truncate">{task.title}</div>
        <div className="text-[10px] opacity-90">{task.assigneeName}</div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">View your tasks in calendar format</p>
        </div>

        <Select value={filterRoom} onValueChange={setFilterRoom}>
          <SelectTrigger className="w-[200px]">
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
      </div>

      {/* Legend */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500"></div>
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-500"></div>
              <span>P1 - High Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-orange-500"></div>
              <span>P2 - Medium Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-purple-500"></div>
              <span>P3 - Low Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-500"></div>
              <span>P4 / No Priority</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar */}
      <Card>
        <CardContent className="p-6">
          <div style={{ height: "600px" }}>
            <BigCalendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              view={view}
              onView={setView}
              date={date}
              onNavigate={setDate}
              eventPropGetter={eventStyleGetter}
              components={{
                event: EventComponent,
              }}
              popup
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
