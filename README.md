# Tidyly

A smart task management application designed for teams, households, and groups. Tidyly enables collaborative task management with intelligent assignment algorithms, flexible scheduling, and real-time synchronization.

## Features

- **Collaborative Rooms**: Create shared spaces for teams, households, or friend groups
- **Smart Task Assignment[TBD]**: Automatic task rotation using round-robin, random, or least-busy algorithms
- **Flexible Scheduling**: Support for recurring tasks with daily, weekly, monthly, or custom intervals
- **Real-time Notifications**: Get reminded before, on, or after task due dates
- **Activity Tracking**: Monitor progress and view analytics across your tasks and rooms
- **User-friendly Interface**: Clean, modern design built with accessibility in mind

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router
- **Authentication**: Firebase Auth
- **Database**: Cloud Firestore
- **Mobile**: Capacitor (Android support)

## Prerequisites

- Node.js 16.x or higher
- npm or yarn package manager

## Getting Started

### Installation

Clone the repository and install dependencies:

```sh
git clone <repository-url>
cd Tidyly
npm install
```

### Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication and Firestore Database
3. Create a `.env` file in the root directory with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Refer to `FIREBASE_SETUP.md` and `FIRESTORE_SETUP.md` for detailed configuration instructions.

### Development

Start the development server:

```sh
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

Create an optimized production build:

```sh
npm run build
```

Preview the production build locally:

```sh
npm run preview
```

### Linting

Run ESLint to check code quality:

```sh
npm run lint
```

## Mobile Development

This project includes Capacitor for native mobile support.

### Android

Build the Android app:

```sh
npm run build
npx cap sync android
npx cap open android
```

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── auth/        # Authentication components
│   ├── dashboard/   # Dashboard-specific components
│   ├── landing/     # Landing page sections
│   ├── social/      # Social features (rooms, friends)
│   └── ui/          # Base UI components (shadcn/ui)
├── contexts/        # React Context providers
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and configurations
├── pages/           # Page components (routes)
└── types/           # TypeScript type definitions
```

## Deployment

The application is configured for deployment on Vercel. Push to your main branch to trigger automatic deployments.

For other platforms, build the project and serve the `dist` folder as a static site.

## Contributing

Contributions are welcome. Please ensure your code follows the existing style and passes linting checks before submitting a pull request.

## License

This project is private and proprietary.
