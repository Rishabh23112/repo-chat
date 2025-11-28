# Repo Chat - Client-Server Application

A modern full-stack application that allows you to chat with any GitHub repository using AI-powered RAG (Retrieval-Augmented Generation).

## Features

- 🔍 **Repository Analysis**: Clone and analyze any public GitHub repository
- 📁 **File Explorer**: Visual tree view of the repository structure
- 💬 **AI Chat**: Ask questions about the codebase using Google Gemini 1.5 Flash
- 🎨 **Modern UI**: Beautiful, responsive React interface with Tailwind CSS

## Tech Stack

### Backend
- **FastAPI**: Modern, high-performance web framework
- **LangChain**: RAG pipeline and conversational AI
- **ChromaDB**: Vector database for embeddings
- **Google Gemini**: Gemini 1.5 Flash for chat and Gemini embeddings for vector search

### Frontend
- **React**: UI library
- **Vite**: Fast build tool
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client
- **Lucide React**: Beautiful icons

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- Git
- Google Gemini API Key (free tier available at https://ai.google.dev)

### Option 1: Using Batch Scripts (Windows)

1. **Start Backend** (in one terminal):
   ```bash
   start_backend.bat
   ```

2. **Start Frontend** (in another terminal):
   ```bash
   start_frontend.bat
   ```

### Option 2: Manual Setup

1. **Backend Setup**:
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Frontend Setup** (in a new terminal):
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Access the Application**:
   - Open your browser to `http://localhost:5173`
   - Enter a GitHub repository URL (e.g., `https://github.com/username/repo`)
   - Enter your Google Gemini API Key (get one free at https://ai.google.dev)
   - Click "Start Chatting"

## Usage

1. **Enter Repository URL**: Provide any public GitHub repository URL
2. **Add API Key**: Enter your Google Gemini API key (free tier available)
3. **Process Repository**: The app will clone and process the repository
4. **Explore Files**: Browse the repository structure in the left sidebar
5. **Ask Questions**: Use the chat interface to ask questions about the code

## Project Structure

```
repo-chat/
├── backend/              # FastAPI backend
│   ├── main.py          # API endpoints
│   ├── rag.py           # RAG logic
│   ├── utils.py         # Utility functions
│   └── requirements.txt # Python dependencies
├── frontend/            # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # Entry point
│   ├── package.json     # Node dependencies
│   └── vite.config.js   # Vite configuration
└── README.md           # This file
```

## API Endpoints

- `GET /`: Health check
- `POST /process-repo`: Clone repository and generate file tree
  - Body: `{ "url": "repo_url", "gemini_api_key": "your_key" }`
- `POST /chat`: Ask questions about the repository
  - Body: `{ "repo_name": "name", "question": "query", "chat_history": [], "gemini_api_key": "your_key" }`

