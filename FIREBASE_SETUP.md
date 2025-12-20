# Firebase Authentication Setup Guide

This guide will help you set up Firebase authentication for your Tidyly app.

## Prerequisites

- A Google account
- Node.js and npm installed

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Enter your project name (e.g., "Tidyly")
4. Follow the setup wizard (you can disable Google Analytics if you don't need it)

## Step 2: Register Your Web App

1. In your Firebase project dashboard, click the Web icon (`</>`) to add a web app
2. Give your app a nickname (e.g., "Tidyly Web App")
3. Click "Register app"
4. Copy the Firebase configuration object - you'll need this next

## Step 3: Configure Environment Variables

1. Create a `.env` file in the root of your project (it's already in `.gitignore`)
2. Copy the contents from `.env.example` to `.env`
3. Replace the placeholder values with your Firebase config values:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Step 4: Enable Authentication Methods

1. In Firebase Console, go to **Build** → **Authentication**
2. Click "Get started" if it's your first time
3. Go to the **Sign-in method** tab
4. Enable the authentication providers you want:

### Email/Password Authentication
- Click on "Email/Password"
- Toggle "Enable"
- Click "Save"

### Google Authentication
- Click on "Google"
- Toggle "Enable"
- Select a support email for the project
- Click "Save"

## Step 5: Set Up Firestore (Optional but Recommended)

1. In Firebase Console, go to **Build** → **Firestore Database**
2. Click "Create database"
3. Choose "Start in test mode" for development (configure security rules later)
4. Select a location for your database
5. Click "Enable"

## Step 6: Configure Authorized Domains

1. In Firebase Console, go to **Build** → **Authentication**
2. Go to the **Settings** tab
3. Scroll to "Authorized domains"
4. Add your domains:
   - `localhost` (already added by default)
   - Your production domain (e.g., `tidyly.app`)

## Step 7: Test Your Setup

1. Start your development server:
```bash
npm run dev
```

2. Navigate to `/signup` and create a test account
3. Check the Firebase Console → Authentication → Users to see your new user

## Security Best Practices

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Use environment variables** for all sensitive data
3. **Configure Firestore Security Rules** before going to production:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

4. **Set up Firebase App Check** for production to protect against abuse

## Available Authentication Methods

This app supports:
- ✅ Email/Password authentication
- ✅ Google Sign-In
- ✅ Password reset via email

## Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"
- Make sure your `.env` file exists and contains all required variables
- Restart your development server after adding the `.env` file

### "Firebase: Error (auth/unauthorized-domain)"
- Add your domain to Authorized domains in Firebase Console

### Google Sign-In not working
- Ensure Google provider is enabled in Firebase Console
- Check that you've set a support email in the Google sign-in settings

## Next Steps

- Implement user profile management
- Add email verification
- Set up password strength requirements
- Configure Firebase Security Rules
- Add social authentication providers (GitHub, Twitter, etc.)
