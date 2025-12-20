# Firebase Firestore Security Rules Setup

## URGENT: Set up these rules NOW to fix permission errors

To enable database functionality in Tidyly, you need to configure Firestore security rules in the Firebase Console.

## Steps to Configure Firestore Rules

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`tidyly-3a874`)
3. Click on **Firestore Database** in the left sidebar
4. Click on the **Rules** tab
5. Replace the existing rules with the following:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is authenticated
    function isSignedIn() {
      return request.auth != null;
    }
    
    // Helper function to check if user owns the document
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    // Users collection
    match /users/{userId} {
      // Anyone can read user profiles (needed for friend lookups)
      allow read: if isSignedIn();
      
      // Users can only create/update their own profile
      allow create: if isSignedIn() && isOwner(userId);
      allow update: if isSignedIn() && isOwner(userId);
      
      // Users can't delete their profile (optional - can be changed)
      allow delete: if isSignedIn() && isOwner(userId);
    }
    
    // Friend requests collection
    match /friendRequests/{requestId} {
      // Users can read requests where they are sender or receiver
      allow read: if isSignedIn() && (
        resource.data.senderId == request.auth.uid ||
        resource.data.receiverId == request.auth.uid
      );
      
      // Users can create requests where they are the sender
      allow create: if isSignedIn() && 
        request.resource.data.senderId == request.auth.uid;
      
      // Users can update/delete requests where they are sender or receiver
      allow update, delete: if isSignedIn() && (
        resource.data.senderId == request.auth.uid ||
        resource.data.receiverId == request.auth.uid
      );
    }
    
    // Rooms collection
    match /rooms/{roomId} {
      // Users can read rooms they are members of
      allow read: if isSignedIn() && 
        request.auth.uid in resource.data.members;
      
      // Users can create rooms (they become the owner)
      allow create: if isSignedIn() && 
        request.resource.data.ownerId == request.auth.uid;
      
      // Only room owners can update room details
      allow update: if isSignedIn() && 
        resource.data.ownerId == request.auth.uid;
      
      // Only room owners can delete rooms
      allow delete: if isSignedIn() && 
        resource.data.ownerId == request.auth.uid;
    }
    
    // Room join requests collection
    match /roomJoinRequests/{requestId} {
      // Users can read requests where they are sender or the room owner
      allow read: if isSignedIn() && (
        resource.data.userId == request.auth.uid ||
        get(/databases/$(database)/documents/rooms/$(resource.data.roomId)).data.ownerId == request.auth.uid
      );
      
      // Users can create join requests
      allow create: if isSignedIn() && 
        request.resource.data.userId == request.auth.uid;
      
      // Users can update/delete their own requests or room owners can update them
      allow update, delete: if isSignedIn() && (
        resource.data.userId == request.auth.uid ||
        get(/databases/$(database)/documents/rooms/$(resource.data.roomId)).data.ownerId == request.auth.uid
      );
    }
    
    // Tasks collection
    match /tasks/{taskId} {
      // Users can read tasks from rooms they are members of
      allow read: if isSignedIn() && 
        request.auth.uid in get(/databases/$(database)/documents/rooms/$(resource.data.roomId)).data.members;
      
      // Users can create tasks in rooms they are members of
      allow create: if isSignedIn() && 
        request.auth.uid in get(/databases/$(database)/documents/rooms/$(request.resource.data.roomId)).data.members;
      
      // Users can update tasks they created or are assigned to
      allow update: if isSignedIn() && (
        resource.data.createdBy == request.auth.uid ||
        request.auth.uid in resource.data.assignees ||
        request.auth.uid in get(/databases/$(database)/documents/rooms/$(resource.data.roomId)).data.members
      );
      
      // Users can delete tasks they created or room owners can delete
      allow delete: if isSignedIn() && (
        resource.data.createdBy == request.auth.uid ||
        get(/databases/$(database)/documents/rooms/$(resource.data.roomId)).data.ownerId == request.auth.uid
      );
    }
  }
}
```

6. Click **Publish** to save the rules

## What These Rules Do

- **Users**: Authenticated users can read any user profile (for friend lookups), but can only modify their own
- **Friend Requests**: Users can only see and manage friend requests they're involved in
- **Rooms**: Users can only access rooms they're members of; only owners can modify/delete rooms
- **Room Join Requests**: Users can request to join rooms; owners can approve/reject
- **Tasks**: Users can manage tasks in rooms they belong to, with specific permissions for creation, updates, and deletion

## Testing

After publishing these rules:

1. Try creating a room using the "Create Room" button in your app
2. Test adding friends using friend codes
3. Verify tasks can be created and assigned
4. Check that permissions work correctly (e.g., non-members can't see room tasks)

## Firestore Indexes

If you encounter errors about missing indexes, Firebase will provide a direct link in the error message to create the required index automatically.

Common indexes you might need:
- `friendRequests` collection: `receiverId` (Ascending), `status` (Ascending)
- `roomJoinRequests` collection: `roomId` (Ascending), `status` (Ascending)
- `tasks` collection: `roomId` (Ascending), `completed` (Ascending), `dueDate` (Ascending)

## Environment Variables

Make sure these are set in your Vercel deployment:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```
