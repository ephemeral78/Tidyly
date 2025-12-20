export interface Room {
  id: string;
  name: string;
  emoji: string;
  memberCount: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  roomId: string;
  assigneeId: string;
  assigneeName: string;
  priority: 'P1' | 'P2' | 'P3';
  dueDate: string;
  repeat?: 'daily' | 'weekly' | 'monthly' | 'custom' | null;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
}
