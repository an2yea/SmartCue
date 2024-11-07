# SmartCue - Context-Aware Task Management System

Smart task management app that takes the guesswork out of "what to do next" by matching your tasks with your current context using AI.
## Why SmartCue?

In today's fast-paced world, people often struggle with:
- **Decision Fatigue**: Constantly deciding which task to tackle next
- **Missed Opportunities**: Not realizing when they could be completing certain tasks
- **Poor Task Prioritization**: Unable to effectively match tasks with available time and context
- **Task Pile-up**: Tasks accumulating because they weren't completed at opportune moments

SmartCue solves these problems by:
- **Eliminating Decision Fatigue**: AI-powered recommendations remove the mental burden of choosing what to do next
- **Contextual Awareness**: Suggests tasks that match your current situation (location, available time, resources)
- **Smart Time Utilization**: Helps you make the most of small time windows (like commutes or waiting periods)
- **Proactive Task Management**: Instead of reactive task completion, get ahead of your to-do list by maximizing every opportunity

For example:
- During a 30-minute train ride? SmartCue might suggest completing quick email responses
- Waiting at a coffee shop with laptop? It could recommend working on that presentation draft
- Driving to work? It might suggest listening to that pending audiobook or podcast

## Features

- **User Authentication**: Secure login and registration system using Firebase Authentication
- **Task Management**: 
  - Create, read, update, and delete tasks
  - Set task details including title, description, deadline, and complexity
  - Specify task duration in minutes, hours, or days
- **Context-Aware Recommendations**: 
  - Input your current context (e.g., "in a cab for 30 minutes with internet access")
  - Receive AI-powered task recommendations based on your context and task list
- **Real-time Updates**: Changes to tasks are reflected immediately using Firebase's real-time database

## Technologies Used

- **Frontend**: 
  - Next.js 13+ (React)
  - CSS Modules for styling
- **Backend**: 
  - Firebase (Authentication, Firestore)
  - Vertex AI (Gemini 1.5 Flash model)
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **AI/ML**: Google Vertex AI with Gemini model

## Prerequisites

Before you begin, ensure you have:
- Node.js (v14 or higher)
- npm or yarn
- A Firebase account
- A Google Cloud account with Vertex AI API enabled

## Setup and Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/smartcue.git
   cd smartcue
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure Firebase**
   - Create a new Firebase project
   - Enable Authentication and Firestore
   - Create a web app in your Firebase project
   - Copy the Firebase configuration
   - Create a `.env.local` file in the root directory:
     ```
     NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
     ```

4. **Configure Vertex AI**
   - Enable Vertex AI API in Google Cloud Console
   - Set up authentication credentials
   - Ensure your service account has the necessary permissions

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
