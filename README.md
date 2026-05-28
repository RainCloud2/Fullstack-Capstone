# StudySync Fullstack Application

This project is a full-stack educational platform built with a React + Vite frontend, a Node.js API, and a Python FastAPI backend for AI-driven features (like Knowledge Tracing and Recommendations).

## 🛠️ Project Structure

The repository is split into three main operational parts:
1. **Frontend:** React + Vite application (/src, /public).
2. **Node Server:** Express/Node API (/server).
3. **AI Backend:** Python FastAPI application (/ai-backend).

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your machine:
* Node.js (v16 or higher recommended)
* Python (v3.8 or higher)
* Git

## 🚀 Setup & Installation

### 1. Frontend & Node API Setup
Navigate to the root directory of the project and install the JavaScript dependencies:
$ npm install

### 2. AI Backend Setup
Open a new terminal, navigate to the AI backend directory, and set up your Python environment:
$ cd ai-backend
$ python -m venv venv

# Activate the virtual environment (Windows)
$ venv\Scripts\activate

# Activate the virtual environment (Mac/Linux)
$ source venv/bin/activate

# Install Python dependencies
$ pip install -r requirements.txt

## 💻 Running the Application

To run the full application locally, you will need to open three separate terminal windows.

### Terminal 1: Run the Frontend (Vite)
From the root directory, start the React development server:
$ npm run dev
*The frontend will typically run on http://localhost:5173*

### Terminal 2: Run the Node Server
From the root directory, start the StudySync Node API:
$ npm run server
*The Node API will run on http://localhost:3001*

### Terminal 3: Run the AI Backend (FastAPI)
Navigate to the ai-backend directory (ensure your virtual environment is activated) and start the Uvicorn server:
$ cd ai-backend
$ uvicorn app.main:app --reload --port 8000
*The AI API will run on http://localhost:8000*
