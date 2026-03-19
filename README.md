# 🧠 Cognify AI
### Adaptive Reading for Every Mind

Cognify AI is an intelligent reading assistant built for ADHD and dyslexia users. It adapts to how you read, identifies difficult sections, and uses AI to simplify them in real-time.

---

## ✨ Features

- 📖 **Smart Reading Interface** — Paste text or upload PDF with dyslexia-friendly fonts
- 🔍 **Behavior Tracking** — Tracks scroll speed, pauses, and backtracking to identify difficult sections
- 🤖 **AI Simplification** — Click any difficult paragraph to get an AI-simplified version
- 🧠 **Cognitive Dashboard** — Personal reading profile with focus score and reading speed
- 📊 **Difficulty Heatmap** — Visual red/green overlay showing easy vs difficult paragraphs
- 🎯 **Comprehension Quiz** — Auto-generated MCQ quiz to test understanding
- 🔊 **Text to Speech** — Read aloud with adjustable speed and pitch
- 💬 **AI Reading Companion** — Ask questions about the text using AI
- 📈 **Progress History** — Track reading sessions over time

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript + Tailwind CSS |
| Backend | Python + FastAPI |
| AI Model | Groq (LLaMA 3.1) |
| ML Model | Scikit-learn Random Forest (difficulty prediction) |
| NLP | NLTK |
| Deployment | Vercel + Render |

---

## 🚀 How to run this project??

### Prerequisites
- Node.js
- Python 3.10+
- Groq API Key (free at console.groq.com)

### Installation

**1. Clone the repo:**
```bash
git clone https://github.com/atharvakelkar1108-rgb/cognify-ai.git
cd cognify-ai
```

**2. Setup Frontend:**
```bash
npm install
npm run dev
```

**3. Setup Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

**4. Add API Keys:**
```bash
# Create backend/.env file
GROQ_API_KEY=your_groq_api_key_here
```

**5. Run Backend:**
```bash
uvicorn main:app --reload
```

**6. Open browser:**
```
Frontend: http://localhost:8080
Backend:  http://localhost:8000/docs
```

---

## 🧠 How It Works
```
User reads text
      ↓
Behavior Tracker monitors scroll/pause/backtrack
      ↓
ML Model identifies difficult paragraphs
      ↓
User clicks difficult paragraph
      ↓
Groq AI simplifies it in real-time
      ↓
Cognitive Dashboard updates with stats
```

---

## 📁 Project Structure
```
cognify-ai/
├── src/                    # React Frontend
│   ├── components/         # UI Components
│   ├── hooks/              # Custom React Hooks
│   ├── services/           # API Service Calls
│   └── pages/              # Page Components
├── backend/                # Python Backend
│   ├── main.py             # FastAPI Server
│   ├── utils/              # AI & NLP Utilities
│   └── models/             # ML Models
└── public/                 # Static Assets
```

---

## 👥 Target Users

- 🧠 People with **ADHD** — Focus mode, behavior tracking
- 📚 People with **Dyslexia** — Font options, text simplification
- 🎓 **Students** — Quiz generator, reading companion
- 📖 Anyone who wants to **read better**

---

## 🏆 Built For

KodeMaster AI Hackathon 2026

---

## 📄 License

MIT License — feel free to use and modify!