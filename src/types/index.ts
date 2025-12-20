export interface Room {
  id: string;
  name: string;
  emoji: string;
  memberCount: number;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskLabel {
  id: string;
  name: string;
  color?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  roomId: string;
  assigneeId: string;
  assigneeName: string;
  assignees?: string[]; // Array of user IDs for multiple assignees
  priority: 'P1' | 'P2' | 'P3' | 'P4' | null;
  dueDate: string;
  repeat?: 'daily' | 'weekly' | 'monthly' | 'custom' | null;
  completed: boolean;
  completedAt?: string;
  completedBy?: string;
  createdAt: string;
  labels?: TaskLabel[];
  subtasks?: SubTask[];
  points?: number;
  requiresApproval?: boolean;
  approvedBy?: string;
  notifyBefore?: number; // minutes before due date
  notifyOnCompletion?: boolean;
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
  emailVerified?: boolean;
  phoneNumber?: string;
}
