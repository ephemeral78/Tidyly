# CRITICAL: Set Up Firestore NOW

## You're getting permission errors because Firestore rules aren't set up yet!

### Quick Fix (2 minutes):

1. **Open Firebase Console**: https://console.firebase.google.com/project/tidyly-3a874/firestore/rules

2. **Click the link in your browser console** - It will take you directly to create the missing index

3. **Paste these rules and click "Publish"**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() {
      return request.auth != null;
    }
    
    match /users/{userId} {
      allow read: if isSignedIn();
      allow write: if isSignedIn() && request.auth.uid == userId;
    }
    
    match /friendRequests/{requestId} {
      allow read, write: if isSignedIn();
    }
    
    match /rooms/{roomId} {
      allow read: if isSignedIn() && request.auth.uid in resource.data.members;
      allow create: if isSignedIn();
      allow update, delete: if isSignedIn() && resource.data.ownerId == request.auth.uid;
    }
    
    match /roomJoinRequests/{requestId} {
      allow read, write: if isSignedIn();
    }
    
    match /tasks/{taskId} {
      allow read, write: if isSignedIn();
    }
  }
}
```

4. **Click "Publish"**

5. **Refresh your app** - Everything should work!

---

## Why this is happening:

- Firestore is secure by default - denies all access
- You need to publish security rules to allow authenticated users to read/write
- The index error will auto-fix when you click the link in the console

## After publishing rules:

✅ Users can create rooms
✅ Tasks will save to database
✅ Data persists across refreshes
✅ Real-time sync works

**DO THIS NOW** - Your app won't work until these rules are published!
