# Rogue Mentor | Elite Career Intelligence

## Overview
Rogue Mentor is an AI-driven career intelligence application built to deliver
strategic, unconventional guidance for professionals navigating modern careers.
It leverages large language models to provide insight beyond traditional career advice,
focusing on positioning, leverage, and long-term impact.

## Deployment
- **Status:** Stable 
- **Primary Access:** https://roguementor.vercel.app 
- **Host Network:** Vercel Edge Network

## Key Features
- **Intelligence Interface:** Modular system organized into Archive, Intel, and Identity protocols.
- **Voice Interaction:** Real-time speech-to-text input with native audio playback.
- **Local Persistence:** Session history stored securely in the user’s browser.
- **Responsive Design:** Mobile-first architecture ensuring full cross-device compatibility.

## Technology Stack
- **Frontend:** React + Vite
- **Styling:** Tailwind CSS, shadcn/ui
- **Language:** TypeScript

## Installation & Local Setup
Ensure Node.js is installed on your system.

```bash
# Clone the repository
git clone https://github.com/Black-Ace18/rogue-mentor.git

# Enter the project directory
cd rogue-mentor

# Install dependencies
npm install

# Environment configuration
# Create a .env.local file and add:
# VITE_GEMINI_API_KEY=your_api_key

# Start development server
npm run dev
