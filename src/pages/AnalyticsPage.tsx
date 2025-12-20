import { useState, useMemo } from "react";
import { FirestoreTask, FirestoreRoom, FirestoreUser } from "@/types/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";
import { CheckCircle2, Clock, TrendingUp, Award } from "lucide-react";
import { format, subDays, startOfDay, endOfDay } from "date-fns";

interface AnalyticsPageProps {
  tasks: FirestoreTask[];
  rooms: FirestoreRoom[];
  users: FirestoreUser[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function AnalyticsPage({ tasks, rooms, users }: AnalyticsPageProps) {
  const [timeRange, setTimeRange] = useState<string>("7");
  const [selectedRoom, setSelectedRoom] = useState<string>("all");

  const filteredTasks = useMemo(() => {
    const days = parseInt(timeRange);
    const cutoffDate = subDays(new Date(), days);
    
    return tasks.filter((task) => {
      const taskDate = new Date(task.createdAt);
      const matchesTimeRange = taskDate >= cutoffDate;
      const matchesRoom = selectedRoom === "all" || task.roomId === selectedRoom;
      return matchesTimeRange && matchesRoom;
    });
  }, [tasks, timeRange, selectedRoom]);

  // Overall statistics
  const stats = useMemo(() => {
    const completed = filteredTasks.filter((t) => t.completed).length;
    const pending = filteredTasks.filter((t) => !t.completed).length;
    const overdue = filteredTasks.filter((t) => {
      if (t.completed) return false;
      return new Date(t.dueDate) < new Date();
    }).length;
    const totalPoints = filteredTasks
      .filter((t) => t.completed && t.points)
      .reduce((sum, t) => sum + (t.points || 0), 0);

    return { completed, pending, overdue, totalPoints, total: filteredTasks.length };
  }, [filteredTasks]);

  // Completion rate by user
  const userStats = useMemo(() => {
    return users.map((user) => {
      const userTasks = filteredTasks.filter((t) => t.assigneeId === user.uid);
      const completed = userTasks.filter((t) => t.completed).length;
      const total = userTasks.length;
      const points = userTasks
        .filter((t) => t.completed && t.points)
        .reduce((sum, t) => sum + (t.points || 0), 0);

      return {
        uid: user.uid,
        name: user.displayName,
        completed,
        pending: total - completed,
        total,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
        points,
      };
    }).filter((u) => u.total > 0);
  }, [filteredTasks, users]);

  // Priority distribution
  const priorityStats = useMemo(() => {
    const priorities = ['P1', 'P2', 'P3', 'P4', 'None'];
    return priorities.map((priority) => {
      const count = filteredTasks.filter((t) => 
        priority === 'None' ? !t.priority : t.priority === priority
      ).length;
      return { name: priority, value: count };
    }).filter((p) => p.value > 0);
  }, [filteredTasks]);

  // Completion trend (last 7 days)
  const completionTrend = useMemo(() => {
    const days = parseInt(timeRange);
    const trend = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dayStart = startOfDay(date);
      const dayEnd = endOfDay(date);
      
      const completed = tasks.filter((t) => {
        if (!t.completedAt) return false;
        const completedDate = new Date(t.completedAt);
        return completedDate >= dayStart && completedDate <= dayEnd;
      }).length;

      trend.push({
        date: format(date, 'MMM dd'),
        completed,
      });
    }
    
    return trend;
  }, [tasks, timeRange]);

  // Room distribution
  const roomStats = useMemo(() => {
    return rooms.map((room) => {
      const roomTasks = filteredTasks.filter((t) => t.roomId === room.id);
      const completed = roomTasks.filter((t) => t.completed).length;
      return {
        name: `${room.emoji} ${room.name}`,
        completed,
        pending: roomTasks.length - completed,
        total: roomTasks.length,
      };
    }).filter((r) => r.total > 0);
  }, [filteredTasks, rooms]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Track your productivity and task completion</p>
        </div>

        <div className="flex gap-2">
          <Select value={selectedRoom} onValueChange={setSelectedRoom}>
            <SelectTrigger className="w-[180px]">
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

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="14">Last 14 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.completed} completed, {stats.pending} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overdue}</div>
            <p className="text-xs text-muted-foreground">
              Tasks past due date
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <Award className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPoints}</div>
            <p className="text-xs text-muted-foreground">
              Points earned
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="completion" className="space-y-4">
        <TabsList>
          <TabsTrigger value="completion">Completion Trend</TabsTrigger>
          <TabsTrigger value="users">By User</TabsTrigger>
          <TabsTrigger value="rooms">By Room</TabsTrigger>
          <TabsTrigger value="priority">Priority Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="completion" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Completion Trend</CardTitle>
              <CardDescription>Tasks completed each day</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={completionTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance by User</CardTitle>
              <CardDescription>Task completion and points earned</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={userStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" fill="#10b981" name="Completed" />
                  <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Points Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {userStats
                  .sort((a, b) => b.points - a.points)
                  .map((user, index) => (
                    <div key={user.uid} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.completed} tasks completed
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-yellow-600">{user.points}</p>
                        <p className="text-xs text-muted-foreground">points</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rooms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tasks by Room</CardTitle>
              <CardDescription>Distribution across rooms</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={roomStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" fill="#10b981" name="Completed" />
                  <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="priority" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Priority Distribution</CardTitle>
              <CardDescription>Tasks grouped by priority level</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={priorityStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {priorityStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
