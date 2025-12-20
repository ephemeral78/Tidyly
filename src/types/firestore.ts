// Firestore data models and types

export interface FirestoreUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  friendCode: string; // Unique code for friend invitations
  friends: string[]; // Array of friend UIDs
  rooms: string[]; // Array of room IDs user belongs to
  createdAt: string;
  updatedAt: string;
}

export interface FirestoreRoom {
  id: string;
  name: string;
  emoji: string;
  description?: string;
  ownerId: string;
  inviteCode: string; // Unique code for room invitations
  members: string[]; // Array of member UIDs
  createdAt: string;
  updatedAt: string;
}

export interface FirestoreTask {
  id: string;
  title: string;
  description?: string;
  roomId: string;
  assigneeId: string;
  assigneeName: string;
  assignees?: string[];
  priority: 'P1' | 'P2' | 'P3' | 'P4' | null;
  dueDate: string;
  repeat?: 'daily' | 'weekly' | 'monthly' | 'custom' | null;
  completed: boolean;
  completedAt?: string;
  completedBy?: string;
  createdAt: string;
  updatedAt: string;
  labels?: { id: string; name: string; color?: string }[];
  subtasks?: { id: string; title: string; completed: boolean }[];
  points?: number;
  requiresApproval?: boolean;
  approvedBy?: string;
  notifyBefore?: number;
  notifyOnCompletion?: boolean;
  createdBy: string;
}

export interface FriendRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  receiverId: string;
  receiverName: string;
  receiverEmail: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface RoomJoinRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  roomId: string;
  roomName: string;
  ownerId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}
