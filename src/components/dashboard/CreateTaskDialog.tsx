import { useState, useEffect } from "react";
import { Task, SubTask, TaskLabel } from "@/types";
import { FirestoreRoom, FirestoreUser, FirestoreTask } from "@/types/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, X, Plus, Tag, Users, Settings } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (task: Partial<FirestoreTask>) => void;
  rooms: FirestoreRoom[];
  users: FirestoreUser[];
  editTask?: FirestoreTask | null;
  defaultRoomId?: string | null;
}

export function CreateTaskDialog({
  open,
  onOpenChange,
  onSave,
  rooms,
  users,
  editTask,
  defaultRoomId,
}: CreateTaskDialogProps) {
  // Basic fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [roomId, setRoomId] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("P2");
  const [dueDate, setDueDate] = useState<Date>();
  const [repeat, setRepeat] = useState<string>("none");
  
  // Advanced fields
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [labels, setLabels] = useState<TaskLabel[]>([]);
  const [newLabel, setNewLabel] = useState("");
  const [subtasks, setSubtasks] = useState<SubTask[]>([]);
  const [newSubtask, setNewSubtask] = useState("");
  
  // Settings
  const [points, setPoints] = useState<number>(0);
  const [enablePoints, setEnablePoints] = useState(false);
  const [requiresApproval, setRequiresApproval] = useState(false);
  const [enableNotifications, setEnableNotifications] = useState(false);
  const [notifyBefore, setNotifyBefore] = useState<number>(30);
  const [notifyOnCompletion, setNotifyOnCompletion] = useState(false);

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setDescription(editTask.description || "");
      setRoomId(editTask.roomId);
      setSelectedAssignees(editTask.assignees || [editTask.assigneeId]);
      setPriority(editTask.priority);
      setDueDate(new Date(editTask.dueDate));
      setRepeat(editTask.repeat || "none");
      setLabels(editTask.labels || []);
      setSubtasks(editTask.subtasks || []);
      setPoints(editTask.points || 0);
      setEnablePoints(!!(editTask.points && editTask.points > 0));
      setRequiresApproval(editTask.requiresApproval || false);
      setNotifyBefore(editTask.notifyBefore || 30);
      setNotifyOnCompletion(editTask.notifyOnCompletion || false);
      setEnableNotifications(!!(editTask.notifyBefore || editTask.notifyOnCompletion));
    } else {
      // Reset form
      setTitle("");
      setDescription("");
      setRoomId(defaultRoomId || rooms[0]?.id || "");
      setSelectedAssignees([users[0]?.uid || ""]);
      setPriority("P2");
      setDueDate(new Date());
      setRepeat("none");
      setLabels([]);
      setSubtasks([]);
      setPoints(0);
      setEnablePoints(false);
      setRequiresApproval(false);
      setEnableNotifications(false);
      setNotifyBefore(30);
      setNotifyOnCompletion(false);
    }
  }, [editTask, open, defaultRoomId, rooms, users]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !roomId || selectedAssignees.length === 0 || !dueDate) return;

    const primaryAssignee = users.find((u) => u.uid === selectedAssignees[0]);
    
    onSave({
      title,
      description: description || undefined,
      roomId,
      assigneeId: selectedAssignees[0],
      assigneeName: primaryAssignee?.displayName || "",
      assignees: selectedAssignees,
      priority,
      dueDate: dueDate.toISOString(),
      repeat: repeat === "none" ? null : (repeat as Task["repeat"]),
      labels: labels.length > 0 ? labels : undefined,
      subtasks: subtasks.length > 0 ? subtasks : undefined,
      points: enablePoints ? points : undefined,
      requiresApproval,
      notifyBefore: enableNotifications ? notifyBefore : undefined,
      notifyOnCompletion: enableNotifications ? notifyOnCompletion : undefined,
    });
    onOpenChange(false);
  };

  const toggleAssignee = (userId: string) => {
    if (selectedAssignees.includes(userId)) {
      if (selectedAssignees.length > 1) {
        setSelectedAssignees(selectedAssignees.filter((id) => id !== userId));
      }
    } else {
      setSelectedAssignees([...selectedAssignees, userId]);
    }
  };

  const addLabel = () => {
    if (newLabel.trim()) {
      const label: TaskLabel = {
        id: Date.now().toString(),
        name: newLabel.trim(),
      };
      setLabels([...labels, label]);
      setNewLabel("");
    }
  };

  const removeLabel = (labelId: string) => {
    setLabels(labels.filter((l) => l.id !== labelId));
  };

  const addSubtask = () => {
    if (newSubtask.trim()) {
      const subtask: SubTask = {
        id: Date.now().toString(),
        title: newSubtask.trim(),
        completed: false,
      };
      setSubtasks([...subtasks, subtask]);
      setNewSubtask("");
    }
  };

  const removeSubtask = (subtaskId: string) => {
    setSubtasks(subtasks.filter((s) => s.id !== subtaskId));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editTask ? "Edit Task" : "Create Task"}</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic Details</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="title">Name *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What is the name of this task?"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this task about?"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <p className="text-sm text-muted-foreground">How important is this task?</p>
              <Select value={priority || "none"} onValueChange={(v) => setPriority(v === "none" ? null : v as Task["priority"])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="P1">P1 - Highest</SelectItem>
                  <SelectItem value="P2">P2 - High</SelectItem>
                  <SelectItem value="P3">P3 - Medium</SelectItem>
                  <SelectItem value="P4">P4 - Low</SelectItem>
                  <SelectItem value="none">No Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>
                <Tag className="inline h-4 w-4 mr-1" />
                Labels
              </Label>
              <p className="text-sm text-muted-foreground">Things to remember about this task or to tag it</p>
              <div className="flex gap-2">
                <Input
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="Add a label..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addLabel();
                    }
                  }}
                />
                <Button type="button" onClick={addLabel} size="icon" variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {labels.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {labels.map((label) => (
                    <Badge key={label.id} variant="secondary">
                      {label.name}
                      <button
                        type="button"
                        onClick={() => removeLabel(label.id)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Sub Tasks</Label>
              <div className="flex gap-2">
                <Input
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  placeholder="Add new task..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSubtask();
                    }
                  }}
                />
                <Button type="button" onClick={addSubtask} size="icon" variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {subtasks.length > 0 && (
                <div className="space-y-2 mt-2">
                  {subtasks.map((subtask) => (
                    <div key={subtask.id} className="flex items-center gap-2 p-2 rounded-md bg-muted">
                      <span className="flex-1 text-sm">{subtask.title}</span>
                      <button
                        type="button"
                        onClick={() => removeSubtask(subtask.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>
                <Users className="inline h-4 w-4 mr-1" />
                Assignees
              </Label>
              <p className="text-sm text-muted-foreground">Who can do this task?</p>
              <div className="space-y-2 border rounded-md p-3">
                {users.map((user) => (
                  <div key={user.uid} className="flex items-center space-x-2">
                    <Checkbox
                      id={`assignee-${user.uid}`}
                      checked={selectedAssignees.includes(user.uid)}
                      onCheckedChange={() => toggleAssignee(user.uid)}
                    />
                    <label
                      htmlFor={`assignee-${user.uid}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {user.displayName}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Room *</Label>
              <Select value={roomId} onValueChange={setRoomId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select room" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      {room.emoji} {room.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Repeat</Label>
              <p className="text-sm text-muted-foreground">Is this something needed to be done regularly?</p>
              <Select value={repeat} onValueChange={setRepeat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No repeat</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Due Date</Label>
              <p className="text-sm text-muted-foreground">Task needs to be completed by a specific time</p>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Task Settings
              </h4>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Assign points for completion</Label>
                    <p className="text-sm text-muted-foreground">
                      User will earn points when they completed it
                    </p>
                  </div>
                  <Switch
                    checked={enablePoints}
                    onCheckedChange={setEnablePoints}
                  />
                </div>

                {enablePoints && (
                  <div className="pl-4">
                    <Input
                      type="number"
                      min="0"
                      value={points || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPoints(val === "" ? 0 : parseInt(val));
                      }}
                      placeholder="Points..."
                    />
                  </div>
                )}

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require admin approval</Label>
                    <p className="text-sm text-muted-foreground">
                      This task will need approval from an admin before being marked as complete
                    </p>
                  </div>
                  <Switch
                    checked={requiresApproval}
                    onCheckedChange={setRequiresApproval}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notify for this task</Label>
                    <p className="text-sm text-muted-foreground">
                      When should receive notifications for this task
                    </p>
                  </div>
                  <Switch
                    checked={enableNotifications}
                    onCheckedChange={setEnableNotifications}
                  />
                </div>

                {enableNotifications && (
                  <div className="pl-4 space-y-3">
                    <div className="space-y-2">
                      <Label>Notify before (minutes)</Label>
                      <Select value={notifyBefore.toString()} onValueChange={(v) => setNotifyBefore(parseInt(v))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                          <SelectItem value="1440">1 day</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="notify-completion"
                        checked={notifyOnCompletion}
                        onCheckedChange={(checked) => setNotifyOnCompletion(checked as boolean)}
                      />
                      <label
                        htmlFor="notify-completion"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Notify on completion
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            {editTask ? "Update" : "Create"} Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
