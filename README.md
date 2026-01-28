Rogue Mentor
Project Overview
Rogue Mentor is an AI-driven career intelligence application designed to provide strategic career guidance. It utilizes large language models to offer unconventional perspectives on professional development, networking, and industry positioning.

Live Access and Distribution
Web Application: https://roguementor.vercel.app

Android Executable (APK): Available via the GitHub Releases section.

Core Features
Intelligence Interface: A modular navigation system categorized into Archive, Intel, and Identity protocols.

Voice Integration: Supports real-time speech-to-text input and native audio playback for hands-free interaction.

Client-Side Persistence: Utilizes browser storage to maintain session history and mission logs without external database dependencies.

Responsive Architecture: Built with a mobile-first approach to ensure full functionality across various device form factors.

Technical Specifications
Frontend Framework: React with Vite for optimized build performance.

Styling: Tailwind CSS and shadcn/ui for a consistent, modular component library.

Language: TypeScript for static type checking and code maintainability.

AI Integration: Leverages Google’s Generative AI SDK for natural language processing.

Installation and Local Setup
To run this project locally, ensure you have Node.js installed on your system.

Bash

# Clone the repository
git clone https://github.com/Black-Ace18/Chess-App.git

# Enter the directory
cd Chess-App

# Install dependencies
npm install

# Environment Configuration
# Create a .env.local file in the root and add:
# VITE_GEMINI_API_KEY=your_api_key

# Launch development server
npm run dev
Security and Data Handling
The application is designed with a privacy-first approach. All interaction logs are stored locally in the user's browser. API calls are handled via secure endpoints, and no personal data is collected or stored on external servers.
