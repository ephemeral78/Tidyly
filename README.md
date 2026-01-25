# Tidyly

A smart task management application designed for teams, households, and groups. Tidyly enables collaborative task management with intelligent assignment algorithms, flexible scheduling, and real-time synchronization.

## Vision Document

### Project Name & Overview

**Tidyly** is a collaborative task management platform that empowers teams, households, and friend groups to organize, assign, and track tasks efficiently. By combining intelligent task distribution algorithms with a user-friendly interface, Tidyly transforms task management from a tedious individual responsibility into a streamlined collaborative experience.

### Problem It Solves

1. **Task Assignment Chaos**: Households and teams struggle with fairly and efficiently distributing tasks among members, often leading to forgotten responsibilities and conflicts.
2. **Lack of Visibility**: Without a centralized system, task progress and accountability become opaque, making it difficult to track who is responsible for what.
3. **Poor Coordination**: Multiple separate task lists and communication channels lead to duplicated efforts and missed deadlines.
4. **No Intelligent Distribution**: Manual task assignment is time-consuming and prone to unfairness (some members consistently assigned more or less work).
5. **Limited Recurring Task Support**: Most tools lack sophisticated scheduling for recurring tasks with various intervals and smart rotation mechanisms.

### Target Users (Personas)

1. **The Household Manager**
   - Lives with family or roommates (2-8 people)
   - Spends significant time coordinating household chores
   - Values fairness and equal distribution of responsibilities
   - Wants real-time visibility into task completion
   - Uses mobile devices on-the-go for quick updates

2. **The Team Lead**
   - Manages small to medium-sized teams (5-20 people)
   - Needs to distribute work based on member workload and skills
   - Requires task analytics and progress tracking
   - Values automated workflows to reduce administrative overhead
   - Operates primarily on desktop but needs mobile support

3. **The Friend Group Organizer**
   - Coordinates events and responsibilities among close friends
   - Wants a casual yet reliable way to track shared activities
   - Needs simple, intuitive tools without complexity
   - Prefers mobile-first interaction
   - Values real-time notifications to keep everyone informed

### Vision Statement

"Empower collaborative groups to organize their work fairly and efficiently, eliminating task management friction through intelligent automation, transparent communication, and accessible design."

### Key Features / Goals

#### Phase 1 (Current - MVP)
- ✅ **Collaborative Rooms**: Create and manage shared workspaces for different groups
- ✅ **User Management**: Add members and manage room access and permissions
- ✅ **Basic Task Creation**: Create tasks with titles, descriptions, and due dates
- ✅ **Task Assignment**: Manually assign tasks to room members
- 🔄 **Real-time Synchronization**: Live updates across all connected devices (via Firestore)
- 🔄 **User-friendly Interface**: Clean, modern, accessible UI built with React and shadcn/ui

#### Phase 2 (Development)
- ⏳ **Smart Task Assignment**: Implement round-robin, random, and least-busy algorithms
- ⏳ **Recurring Tasks**: Add daily, weekly, monthly, and custom recurring task support
- ⏳ **Activity Analytics**: Dashboard showing task completion rates and member contributions
- ⏳ **Real-time Notifications**: Push notifications for task assignments and deadlines
- ⏳ **Mobile App (Android)**: Full Android application via Capacitor

#### Phase 3 (Future)
- 📋 **Advanced Analytics**: Detailed insights on team productivity and patterns
- 📋 **Task Templates**: Pre-configured task sets for common scenarios
- 📋 **Integration Support**: Connect with calendar systems, Slack, email
- 📋 **Subtasks & Dependencies**: Complex task hierarchies and ordering
- 📋 **Priority Levels & Categories**: Enhanced task organization
- 📋 **iOS Support**: Native iOS application
- 📋 **Team Permissions**: Granular role-based access control

### Success Metrics

#### User Engagement
- Active daily users (DAU) and monthly active users (MAU)
- Average session duration and frequency
- Feature adoption rate (% of users utilizing smart assignment, recurring tasks, etc.)
- Room creation and member invitation rates

#### Task Management Effectiveness
- Average task completion rate per room
- Time-to-completion for assigned tasks
- Task assignment fairness index (deviation from equal distribution)
- Recurring task execution consistency

#### User Satisfaction
- Net Promoter Score (NPS) and user satisfaction surveys
- Support ticket volume and resolution time
- Feature request tracking and implementation rate
- Retention rate (30-day, 60-day, 90-day)

#### Technical Performance
- App load time and responsiveness
- Real-time sync latency (< 1 second target)
- System uptime (99.9% target)
- User-reported bugs and crash rates

#### Growth Metrics
- User sign-up and onboarding completion rate
- Average room size and member retention
- Viral coefficient (invitations per user)
- Conversion metrics (freemium to premium if applicable)

### Assumptions & Constraints

#### Key Assumptions
1. **User Groups are Small**: Target audience operates in groups of 2-20 people (not enterprise-scale)
2. **Mobile-First Adoption**: Users will primarily interact via mobile devices, especially households
3. **Recurring Tasks are Common**: Recurring and rotating tasks are a primary use case
4. **Cloud Storage is Acceptable**: Users trust cloud-based data storage (Firebase)
5. **Real-time Sync is Valued**: Users appreciate instant updates across devices
6. **Collaborative Mindset**: Users are willing to share task visibility with their group
7. **Accessibility Matters**: Users include people with varying technical proficiency

#### Technical Constraints
- **Firebase Limits**: Firestore has read/write quotas (millions per day for Spark plan)
- **Real-time Updates**: Browser/network latency affects synchronization (target: <1 second)
- **Platform Coverage**: Initial focus on web and Android; iOS support in Phase 3
- **Authentication**: Firebase Auth limits concurrent sessions and OAuth providers
- **Storage**: Firestore database size limits apply; long-term archiving needed for historical data
- **Mobile Performance**: React on mobile (via Capacitor) has performance constraints

#### Business/Organizational Constraints
- **Team Size**: Limited development team; prioritize MVP features
- **Budget**: Deployment costs on Vercel and Firebase (free tier available)
- **Timeline**: Iterative development with quarterly milestones
- **Privacy**: Compliance with data privacy regulations (GDPR considerations)
- **Support**: Community-driven support initially; dedicated support in later phases

#### Market Constraints
- **Competition**: Established players (Todoist, Microsoft To Do, Asana) have feature-rich offerings
- **Differentiation**: Must emphasize collaborative, fair task distribution and simplicity
- **Pricing Model**: Freemium or free approach needed to gain traction
- **Localization**: English-only initially; multi-language support later

## Repository Organization & Setup

### Folder Structure

The Tidyly repository is organized for clarity and maintainability:

```
Tidyly/
├── src/                    # Frontend source code
│   ├── components/         # Reusable React components
│   │   ├── auth/          # Authentication-related components
│   │   ├── dashboard/     # Dashboard view components
│   │   ├── landing/       # Landing page sections
│   │   ├── social/        # Room and friend features
│   │   └── ui/            # Base UI components (shadcn/ui)
│   ├── contexts/          # React Context providers for state management
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions and Firebase configuration
│   ├── pages/             # Page-level components (routes)
│   ├── types/             # TypeScript type definitions
│   ├── App.tsx            # Main App component
│   └── main.tsx           # Application entry point
├── android/               # Android native code (Capacitor)
├── public/                # Static assets
├── .gitignore             # Git ignore rules
├── .env.example           # Environment variables template
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite bundler configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── capacitor.config.ts    # Capacitor (mobile) configuration
└── README.md              # This file
```

### .gitignore

A comprehensive `.gitignore` file is included to prevent tracking of:
- Dependency directories (`node_modules/`)
- Build artifacts (`dist/`, `build/`)
- Environment files (`.env`, `.env.local`)
- IDE configurations (`.vscode/`, `.idea/`)
- OS-specific files (`.DS_Store`, `Thumbs.db`)
- Docker artifacts (`Docker.local`, `.dockerignore`)
- Build/cache files (`*.log`, `*.tmp`)
- Firebase emulator data
- Android build artifacts

## Branching Strategy

Tidyly follows **GitHub Flow**, a lightweight and effective branching strategy:

### How It Works

1. **Main Branch (`main`)**: Always production-ready
   - Protected branch
   - All code must pass tests and code review
   - Automatically deployed to production

2. **Feature Branches**: Created from `main`
   - Naming convention: `feature/feature-name` or `fix/issue-name`
   - Example: `feature/smart-task-assignment`, `fix/notification-bug`
   - Work on your feature, push commits regularly

3. **Pull Requests (PRs)**
   - Create a PR when your feature is ready for review
   - Write clear descriptions of changes
   - Ensure CI/CD checks pass
   - Request code review from team members
   - Address feedback and make updates
   - Merge to `main` after approval

4. **After Merge**
   - Delete the feature branch
   - Monitor deployment to production
   - Be ready to revert if issues arise

### Branch Naming Conventions

```
feature/description        # New features
fix/description            # Bug fixes
docs/description           # Documentation updates
refactor/description       # Code refactoring
test/description           # Test additions
chore/description          # Maintenance tasks
```

### Example Workflow

```bash
# 1. Create and switch to a new feature branch
git checkout -b feature/smart-assignment

# 2. Make changes and commit
git add .
git commit -m "Implement smart task assignment algorithm"

# 3. Push to GitHub
git push origin feature/smart-assignment

# 4. Create a Pull Request on GitHub
# 5. Address code review feedback
# 6. Merge when approved
# 7. Delete the feature branch
```

## Quick Start – Local Development

### Prerequisites

Before setting up Tidyly locally, ensure you have:

- **Node.js 16.x or higher** ([Download](https://nodejs.org/))
- **npm or yarn** (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))
- **Firebase Account** ([Create Free Account](https://firebase.google.com/))

### Development Environment Setup

#### Option 1: Using Node.js (Recommended for Development)

1. **Clone the repository**
   ```bash
   git clone https://github.com/ephemeral78/Tidyly.git
   cd Tidyly
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env.local`:
     ```bash
     cp .env.example .env.local
     ```
   - Fill in your Firebase configuration:
     ```
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   - Application will be available at `http://localhost:5173`
   - Hot reload enabled – changes reflect instantly

#### Option 2: Using Docker (Future Enhancement)

Docker support is planned for Tidyly to streamline development across different environments:

**Planned Docker Features:**
- Dockerfile for Node.js environment
- docker-compose.yml for multi-service setup
- Isolated development environment
- Easy team onboarding
- Consistent "works on my machine" environment

Docker integration will be added in a future release. For now, use Node.js directly.

### Useful Development Commands

```bash
# Development server (hot reload)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run linting (ESLint)
npm run lint

# Run linting with auto-fix
npm run lint -- --fix

# Type checking (TypeScript)
npm run type-check

# Format code (if Prettier is configured)
npm run format
```

## Local Development Tools

Tidyly uses industry-standard tools for development, code quality, and deployment:

### Core Technologies

| Tool | Purpose | Version |
|------|---------|----------|
| **Node.js** | JavaScript runtime | 16.x or higher |
| **npm/yarn** | Package manager | Latest |
| **TypeScript** | Static typing | ^5.0 |
| **React** | UI framework | 18+ |
| **Vite** | Build tool & dev server | ^5.0 |

### UI & Styling

| Tool | Purpose |
|------|----------|
| **shadcn/ui** | Pre-built component library |
| **Radix UI** | Headless UI components |
| **Tailwind CSS** | Utility-first CSS framework |
| **PostCSS** | CSS processing |

### State Management & Data Fetching

| Tool | Purpose |
|------|----------|
| **TanStack Query** | Server state management |
| **React Router** | Client-side routing |
| **React Context** | Global state management |
| **Firebase SDK** | Backend services |

### Development & Quality Tools

| Tool | Purpose |
|------|----------|
| **ESLint** | Code quality & style enforcement |
| **TypeScript** | Type safety |
| **Git Hooks** | Pre-commit checks (when configured) |
| **GitHub Actions** | CI/CD automation |

### Backend & Database

| Tool | Purpose |
|------|----------|
| **Firebase Auth** | User authentication |
| **Cloud Firestore** | Real-time database |
| **Firebase Storage** | File storage (when needed) |

### Deployment

| Tool | Purpose |
|------|----------|
| **Vercel** | Web hosting & auto-deployment |
| **Capacitor** | Mobile app framework |
| **Android Studio** | Android development |

### Recommended IDE & Extensions

**VS Code** is recommended with these extensions:
- ES7+ React/Redux/React-Native snippets
- ESLint
- Prettier - Code formatter
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin
- Debugger for Chrome
- Thunder Client (REST API testing)

### Setting Up Your Development Environment

1. **Install Node.js** from [nodejs.org](https://nodejs.org/)
2. **Clone the repository** and install dependencies:
   ```bash
   git clone https://github.com/ephemeral78/Tidyly.git
   cd Tidyly
   npm install
   ```
3. **Configure environment variables** (see Quick Start section above)
4. **Install recommended VS Code extensions**
5. **Start developing** with `npm run dev`

### Troubleshooting Common Issues

**Problem: Modules not found**
```bash
# Solution: Reinstall node_modules
rm -rf node_modules package-lock.json
npm install
```

**Problem: Port 5173 already in use**
```bash
# Solution: Use different port
npm run dev -- --port 5174
```

**Problem: Firebase connection errors**
- Verify `.env.local` has correct Firebase credentials
- Check Firebase Console for authentication and Firestore enablement
- Ensure API keys are not exposed in client code


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
