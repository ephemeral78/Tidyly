import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  writeBatch,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';
import { FirestoreUser, FirestoreRoom, FirestoreTask, FriendRequest, RoomJoinRequest } from '@/types/firestore';

// Generate unique codes
export const generateCode = (length: number = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// ============= USER OPERATIONS =============

export const createUserProfile = async (uid: string, email: string, displayName: string, photoURL: string | null = null) => {
  const friendCode = generateCode();
  const userData: FirestoreUser = {
    uid,
    email,
    displayName,
    photoURL: photoURL || null,
    friendCode,
    friends: [],
    rooms: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(doc(db, 'users', uid), userData);
  return userData;
};

export const getUserProfile = async (uid: string): Promise<FirestoreUser | null> => {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data() as FirestoreUser) : null;
};

export const updateUserProfile = async (uid: string, updates: Partial<FirestoreUser>) => {
  const docRef = doc(db, 'users', uid);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
};

export const getUserByFriendCode = async (friendCode: string): Promise<FirestoreUser | null> => {
  const q = query(collection(db, 'users'), where('friendCode', '==', friendCode));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) return null;
  return querySnapshot.docs[0].data() as FirestoreUser;
};

// ============= FRIEND REQUEST OPERATIONS =============

export const sendFriendRequest = async (
  senderId: string,
  senderName: string,
  senderEmail: string,
  friendCode: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const receiver = await getUserByFriendCode(friendCode);
    
    if (!receiver) {
      return { success: false, message: 'Invalid friend code' };
    }

    if (receiver.uid === senderId) {
      return { success: false, message: 'You cannot add yourself as a friend' };
    }

    if (receiver.friends.includes(senderId)) {
      return { success: false, message: 'You are already friends' };
    }

    // Check for existing pending request
    const existingRequest = query(
      collection(db, 'friendRequests'),
      where('senderId', '==', senderId),
      where('receiverId', '==', receiver.uid),
      where('status', '==', 'pending')
    );
    const existingDocs = await getDocs(existingRequest);

    if (!existingDocs.empty) {
      return { success: false, message: 'Friend request already sent' };
    }

    const requestId = `${senderId}_${receiver.uid}_${Date.now()}`;
    const friendRequest: FriendRequest = {
      id: requestId,
      senderId,
      senderName,
      senderEmail,
      receiverId: receiver.uid,
      receiverName: receiver.displayName,
      receiverEmail: receiver.email,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'friendRequests', requestId), friendRequest);
    return { success: true, message: `Friend request sent to ${receiver.displayName}` };
  } catch (error) {
    console.error('Error sending friend request:', error);
    return { success: false, message: 'Failed to send friend request' };
  }
};

export const getPendingFriendRequests = async (userId: string): Promise<FriendRequest[]> => {
  const q = query(
    collection(db, 'friendRequests'),
    where('receiverId', '==', userId),
    where('status', '==', 'pending'),
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data() as FriendRequest);
};

export const acceptFriendRequest = async (requestId: string) => {
  const requestRef = doc(db, 'friendRequests', requestId);
  const requestSnap = await getDoc(requestRef);
  
  if (!requestSnap.exists()) throw new Error('Request not found');
  
  const request = requestSnap.data() as FriendRequest;
  
  const batch = writeBatch(db);
  
  // Update request status
  batch.update(requestRef, {
    status: 'accepted',
    updatedAt: new Date().toISOString(),
  });
  
  // Add to both users' friends lists
  const senderRef = doc(db, 'users', request.senderId);
  const receiverRef = doc(db, 'users', request.receiverId);
  
  const senderSnap = await getDoc(senderRef);
  const receiverSnap = await getDoc(receiverRef);
  
  if (senderSnap.exists() && receiverSnap.exists()) {
    const senderData = senderSnap.data() as FirestoreUser;
    const receiverData = receiverSnap.data() as FirestoreUser;
    
    batch.update(senderRef, {
      friends: [...senderData.friends, request.receiverId],
      updatedAt: new Date().toISOString(),
    });
    
    batch.update(receiverRef, {
      friends: [...receiverData.friends, request.senderId],
      updatedAt: new Date().toISOString(),
    });
  }
  
  await batch.commit();
};

export const rejectFriendRequest = async (requestId: string) => {
  const requestRef = doc(db, 'friendRequests', requestId);
  await updateDoc(requestRef, {
    status: 'rejected',
    updatedAt: new Date().toISOString(),
  });
};

// ============= ROOM OPERATIONS =============

export const createRoom = async (
  name: string,
  emoji: string,
  ownerId: string,
  description?: string
): Promise<FirestoreRoom> => {
  const inviteCode = generateCode(6);
  const roomId = doc(collection(db, 'rooms')).id;
  
  const roomData: FirestoreRoom = {
    id: roomId,
    name,
    emoji,
    description: description || "",
    ownerId,
    inviteCode,
    members: [ownerId],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(doc(db, 'rooms', roomId), roomData);
  
  // Add room to user's rooms list
  const userRef = doc(db, 'users', ownerId);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    const userData = userSnap.data() as FirestoreUser;
    await updateDoc(userRef, {
      rooms: [...userData.rooms, roomId],
      updatedAt: new Date().toISOString(),
    });
  }
  
  return roomData;
};

export const getRoomByInviteCode = async (inviteCode: string): Promise<FirestoreRoom | null> => {
  const q = query(collection(db, 'rooms'), where('inviteCode', '==', inviteCode));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) return null;
  return querySnapshot.docs[0].data() as FirestoreRoom;
};

export const getUserRooms = async (userId: string): Promise<FirestoreRoom[]> => {
  const q = query(collection(db, 'rooms'), where('members', 'array-contains', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data() as FirestoreRoom);
};

// ============= ROOM JOIN REQUEST OPERATIONS =============

export const sendRoomJoinRequest = async (
  userId: string,
  userName: string,
  userEmail: string,
  inviteCode: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const room = await getRoomByInviteCode(inviteCode);
    
    if (!room) {
      return { success: false, message: 'Invalid room code' };
    }

    if (room.members.includes(userId)) {
      return { success: false, message: 'You are already a member of this room' };
    }

    // Check for existing pending request
    const existingRequest = query(
      collection(db, 'roomJoinRequests'),
      where('userId', '==', userId),
      where('roomId', '==', room.id),
      where('status', '==', 'pending')
    );
    const existingDocs = await getDocs(existingRequest);

    if (!existingDocs.empty) {
      return { success: false, message: 'Join request already sent' };
    }

    const requestId = `${userId}_${room.id}_${Date.now()}`;
    const joinRequest: RoomJoinRequest = {
      id: requestId,
      userId,
      userName,
      userEmail,
      roomId: room.id,
      roomName: room.name,
      ownerId: room.ownerId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'roomJoinRequests', requestId), joinRequest);
    return { success: true, message: `Join request sent for ${room.emoji} ${room.name}` };
  } catch (error) {
    console.error('Error sending room join request:', error);
    return { success: false, message: 'Failed to send join request' };
  }
};

export const getPendingRoomJoinRequests = async (ownerId: string): Promise<RoomJoinRequest[]> => {
  const q = query(
    collection(db, 'roomJoinRequests'),
    where('ownerId', '==', ownerId),
    where('status', '==', 'pending'),
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data() as RoomJoinRequest);
};

export const acceptRoomJoinRequest = async (requestId: string) => {
  console.log('acceptRoomJoinRequest called with:', requestId);
  const requestRef = doc(db, 'roomJoinRequests', requestId);
  const requestSnap = await getDoc(requestRef);
  
  if (!requestSnap.exists()) {
    console.error('Room join request not found:', requestId);
    throw new Error('Request not found');
  }
  
  const request = requestSnap.data() as RoomJoinRequest;
  console.log('Room join request data:', request);
  
  const batch = writeBatch(db);
  
  // Update request status
  batch.update(requestRef, {
    status: 'accepted',
    updatedAt: new Date().toISOString(),
  });
  
  // Add user to room members
  const roomRef = doc(db, 'rooms', request.roomId);
  const roomSnap = await getDoc(roomRef);
  
  if (roomSnap.exists()) {
    const roomData = roomSnap.data() as FirestoreRoom;
    console.log('Adding user to room members:', request.userId, 'Room:', request.roomId);
    batch.update(roomRef, {
      members: [...roomData.members, request.userId],
      updatedAt: new Date().toISOString(),
    });
  }
  
  // Add room to user's rooms list
  const userRef = doc(db, 'users', request.userId);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    const userData = userSnap.data() as FirestoreUser;
    console.log('Adding room to user rooms list:', request.roomId, 'User:', request.userId);
    batch.update(userRef, {
      rooms: [...userData.rooms, request.roomId],
      updatedAt: new Date().toISOString(),
    });
  }
  
  console.log('Committing batch update...');
  await batch.commit();
  console.log('Batch committed successfully');
};

export const rejectRoomJoinRequest = async (requestId: string) => {
  const requestRef = doc(db, 'roomJoinRequests', requestId);
  await updateDoc(requestRef, {
    status: 'rejected',
    updatedAt: new Date().toISOString(),
  });
};

// ============= TASK OPERATIONS =============

export const createTask = async (taskData: Omit<FirestoreTask, 'id' | 'createdAt' | 'updatedAt'>): Promise<FirestoreTask> => {
  const taskId = doc(collection(db, 'tasks')).id;
  
  const task: FirestoreTask = {
    ...taskData,
    id: taskId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(doc(db, 'tasks', taskId), task);
  return task;
};

export const updateTask = async (taskId: string, updates: Partial<FirestoreTask>) => {
  const taskRef = doc(db, 'tasks', taskId);
  await updateDoc(taskRef, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
};

export const deleteTask = async (taskId: string) => {
  await deleteDoc(doc(db, 'tasks', taskId));
};

export const getRoomTasks = async (roomId: string): Promise<FirestoreTask[]> => {
  const q = query(
    collection(db, 'tasks'),
    where('roomId', '==', roomId),
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data() as FirestoreTask);
};

export const getUserTasks = async (roomIds: string[]): Promise<FirestoreTask[]> => {
  if (roomIds.length === 0) return [];
  
  const q = query(
    collection(db, 'tasks'),
    where('roomId', 'in', roomIds),
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data() as FirestoreTask);
};

// ============= REALTIME LISTENERS =============

export const subscribeToFriendRequests = (
  userId: string,
  callback: (requests: FriendRequest[]) => void
) => {
  const q = query(
    collection(db, 'friendRequests'),
    where('receiverId', '==', userId),
    where('status', '==', 'pending')
  );
  
  return onSnapshot(q, (snapshot) => {
    const requests = snapshot.docs.map((doc) => doc.data() as FriendRequest);
    callback(requests);
  });
};

export const subscribeToRoomJoinRequests = (
  ownerId: string,
  callback: (requests: RoomJoinRequest[]) => void
) => {
  const q = query(
    collection(db, 'roomJoinRequests'),
    where('ownerId', '==', ownerId),
    where('status', '==', 'pending')
  );
  
  return onSnapshot(q, (snapshot) => {
    const requests = snapshot.docs.map((doc) => doc.data() as RoomJoinRequest);
    callback(requests);
  });
};

export const subscribeToUserRooms = (
  userId: string,
  callback: (rooms: FirestoreRoom[]) => void
) => {
  const q = query(
    collection(db, 'rooms'),
    where('members', 'array-contains', userId)
  );
  
  return onSnapshot(q, (snapshot) => {
    const rooms = snapshot.docs.map((doc) => doc.data() as FirestoreRoom);
    callback(rooms);
  });
};

export const subscribeToRoomTasks = (
  roomId: string,
  callback: (tasks: FirestoreTask[]) => void
) => {
  const q = query(
    collection(db, 'tasks'),
    where('roomId', '==', roomId),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id
    } as FirestoreTask));
    callback(tasks);
  });
};

export const subscribeToMultipleRoomTasks = (
  roomIds: string[],
  callback: (tasks: FirestoreTask[]) => void
) => {
  if (roomIds.length === 0) {
    callback([]);
    return () => {};
  }
  
  const q = query(
    collection(db, 'tasks'),
    where('roomId', 'in', roomIds.slice(0, 10)), // Firestore limit
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id
    } as FirestoreTask));
    callback(tasks);
  });
};
