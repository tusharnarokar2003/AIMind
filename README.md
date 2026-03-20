# AIMind App

AIMind is a comprehensive mental health and journaling application that combines traditional journaling with AI-powered mood analysis and a private AI chat assistant. 

## Features

- **User Authentication**: Secure signup and login functionality.
- **AI-Powered Journaling**: Analyze your journal entries automatically to detect your primary emotion (joy, sadness, anger, fear, surprise, disgust, neutral).
- **Mood Tracking**: View your mood history over time.
- **Private AI Chat**: Converse privately with an on-device/local AI assistant (SmolLM2-360M) for mental health support or casual chatting.
- **Goal Tracking**: Set and monitor your personal goals.
- **Community**: Connect with others through the community page.

## Project Structure

```text
aimind-app/
├── backend/                  # Node.js API for Mood Prediction
│   ├── routes/               # API endpoints (e.g., mood.js)
│   ├── services/             # Core logic (e.g., moodPredictor.js)
│   ├── model.py              # Python script for emotion classification
│   └── server.js             # Main Express server entry point
├── backend2/                 # Python/Flask API for AI Chat Assistant
│   ├── app.py                # Main Flask server entry point
│   ├── model_loader.py       # Module to load SmolLM2-360M
│   └── requirements.txt      # Python dependencies for chat server
├── public/                   # Static assets
├── src/                      # React Frontend Source Code
│   ├── assets/               # Images and icons
│   ├── components/           # Reusable React components
│   ├── context/              # React Context (Auth, Mood)
│   ├── pages/                # Page components (Auth, Home, Notes, etc.)
│   ├── services/             # API services for frontend
│   ├── utils/                # Utility functions
│   ├── App.jsx               # Root application component
│   └── router.jsx            # React Router configuration
├── .env                      # Environment variables
├── index.html                # Vite HTML entry point
├── package.json              # Frontend npm dependencies
├── README.md                 # Project documentation
└── vite.config.js            # Vite configuration
```

## Technical Details

The project is built using a modern microservices architecture, featuring a React frontend and two specialized backends for AI processing.

### Frontend
- **Framework**: React + Vite
- **Routing**: `react-router-dom`
- **Backend-as-a-Service**: Supabase (used for Authentication and Database to store generic user data and mood predictions).
- **Styling**: Standard CSS with modern UI components (`lucide-react`, `react-icons`).

### Backend 1: Mood Prediction API (Node.js)
- **Framework**: Express.js
- **Purpose**: Handles saving journal entries and processing text to predict emotions.
- **AI Integration**: Invokes a Python script (`model.py`) that utilizes `spaCy` (for text tokenization) and Hugging Face Transformers (`j-hartmann/emotion-english-distilroberta-base`) to score text chunks and compute the overall primary emotion.
- **Database**: Connects directly to Supabase (`mood_predictions` table) to log mood history securely.

### Backend 2: AI Chat Server (Python / Flask)
- **Framework**: Flask
- **Purpose**: Provides a conversational AI endpoint (`/chat`).
- **AI Model**: Locally loads `SmolLM2-360M`, a lightweight and extremely fast Large Language Model, using `transformers` and `torch`. It runs fully locally without external API dependencies to ensure privacy.
- **Features**: Maintains session-based conversation history for context-aware responses.

## Requirements

To run this project locally, ensure you have the following installed:

### Global Prerequisites
- Node.js (v18+ recommended)
- Python 3.8+
- Supabase Project (with `mood_predictions` table customized)

### Frontend Dependencies
Navigate to the root directory (`aimind-app`) and install:
```bash
npm install
```

### Backend 1 (Node.js) Dependencies
Navigate to `backend/` and install:
```bash
cd backend
npm install
```
Requires a `.env` file with `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.

### Backend 2 (Python) Dependencies
Navigate to `backend2/` and install the Python requirements:
```bash
cd backend2
pip install -r requirements.txt
```
To run the mood prediction python script seamlessly in `backend1`, you also need `spaCy` and its language model installed globally or in your active python environment:
```bash
pip install spacy transformers torch
python -m spacy download en_core_web_sm
```

## Running the Project
1. **Frontend**: `npm run dev` in the root folder.
2. **Backend 1 (Mood API)**: `npm run dev` in the `backend/` folder (runs on port 3001).
3. **Backend 2 (Chat Server)**: `python app.py` in the `backend2/` folder (runs on port 5000).
