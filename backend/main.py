from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Cognify AI Backend")

# Allow React frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Cognify AI Backend Running!"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

from utils.text_processor import process_text
from pydantic import BaseModel

class TextInput(BaseModel):
    text: str

@app.post("/analyze")
def analyze_text(input: TextInput):
    results = process_text(input.text)
    return {"sentences": results}

from utils.simplifier import simplify_sentence, explain_sentence

class SimplifyInput(BaseModel):
    sentence: str
    level: str = "Easy"

class ExplainInput(BaseModel):
    sentence: str
    mode: str = "eli5"

@app.post("/simplify")
def simplify(input: SimplifyInput):
    result = simplify_sentence(input.sentence, input.level)
    return {"simplified": result}

@app.post("/explain")
def explain(input: ExplainInput):
    result = explain_sentence(input.sentence, input.mode)
    return {"explanation": result}

from utils.behavior_tracker import tracker

class SessionInput(BaseModel):
    user_id: str
    text: str

class EventInput(BaseModel):
    user_id: str
    event: dict

@app.post("/session/start")
def start_session(input: SessionInput):
    return tracker.start_session(input.user_id, input.text)

@app.post("/session/track")
def track_event(input: EventInput):
    return tracker.track_event(input.user_id, input.event)

@app.get("/session/profile/{user_id}")
def get_profile(user_id: str):
    return tracker.get_cognitive_profile(user_id)

@app.get("/session/difficult/{user_id}")
def get_difficult(user_id: str):
    return {"difficult_paragraphs": tracker.get_difficult_paragraphs(user_id)}

from models.difficulty_model import difficulty_model

class PredictInput(BaseModel):
    sentence_data: dict

@app.post("/train")
def train_model():
    return difficulty_model.train()

@app.post("/predict")
def predict_difficulty(input: PredictInput):
    return difficulty_model.predict(input.sentence_data)

from utils.quiz_generator import generate_quiz, evaluate_answer

class QuizInput(BaseModel):
    text: str
    num_questions: int = 5

class AnswerInput(BaseModel):
    question: dict
    user_answer: str

@app.post("/quiz/generate")
def create_quiz(input: QuizInput):
    questions = generate_quiz(input.text, input.num_questions)
    return {"questions": questions}

@app.post("/quiz/evaluate")
def check_answer(input: AnswerInput):
    return evaluate_answer(input.question, input.user_answer)

class CompanionInput(BaseModel):
    text: str
    question: str

@app.post("/companion")
def ask_companion(input: CompanionInput):
    from groq import Groq
    import os
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    
    prompt = f"""You are a helpful reading assistant for ADHD and dyslexia users.
Answer questions about the text in simple, clear language.

Text: {input.text[:2000]}

Question: {input.question}

Answer in 2-3 simple sentences maximum:"""

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=200
        )
        return {"answer": response.choices[0].message.content.strip()}
    except Exception as e:
        return {"answer": f"Error: {str(e)}"}

import json
from datetime import datetime

# In-memory session history (replace with DB later)
session_history = []

class SessionHistoryInput(BaseModel):
    user_id: str
    text_preview: str
    duration_seconds: int
    difficult_count: int
    total_paragraphs: int
    simplified_count: int
    quiz_score: int = 0
    quiz_total: int = 0

@app.post("/history/save")
def save_session(input: SessionHistoryInput):
    session = {
        "id": len(session_history) + 1,
        "timestamp": datetime.now().isoformat(),
        "user_id": input.user_id,
        "text_preview": input.text_preview[:100],
        "duration_seconds": input.duration_seconds,
        "difficult_count": input.difficult_count,
        "total_paragraphs": input.total_paragraphs,
        "simplified_count": input.simplified_count,
        "quiz_score": input.quiz_score,
        "quiz_total": input.quiz_total,
        "focus_score": max(0, 100 - (input.difficult_count * 10) - (input.simplified_count * 2))
    }
    session_history.append(session)
    return {"saved": True, "session_id": session["id"]}

@app.get("/history/{user_id}")
def get_history(user_id: str):
    user_sessions = [s for s in session_history if s["user_id"] == user_id]
    return {"sessions": user_sessions}

from fpdf import FPDF
from fastapi.responses import FileResponse
import tempfile
import os

class ReportInput(BaseModel):
    user_id: str
    text_preview: str
    duration_seconds: int
    difficult_count: int
    total_paragraphs: int
    simplified_count: int
    focus_score: float
    quiz_score: int = 0
    quiz_total: int = 0
    reading_speed: float = 0

@app.post("/report/generate")
def generate_report(input: ReportInput):
    pdf = FPDF()
    pdf.add_page()
    
    # Title
    pdf.set_font("Helvetica", "B", 24)
    pdf.set_text_color(79, 70, 229)
    pdf.cell(0, 15, "Cognify AI - Reading Report", ln=True, align="C")
    
    # Date
    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(100, 100, 100)
    pdf.cell(0, 8, f"Generated: {datetime.now().strftime('%d %B %Y, %I:%M %p')}", ln=True, align="C")
    pdf.ln(5)

    # Divider
    pdf.set_draw_color(79, 70, 229)
    pdf.set_line_width(0.5)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(8)

    # Text Preview
    pdf.set_font("Helvetica", "B", 13)
    pdf.set_text_color(30, 30, 30)
    pdf.cell(0, 8, "Text Read", ln=True)
    pdf.set_font("Helvetica", "I", 10)
    pdf.set_text_color(80, 80, 80)
    pdf.multi_cell(0, 6, f'"{input.text_preview}..."')
    pdf.ln(5)

    # Stats Section
    pdf.set_font("Helvetica", "B", 13)
    pdf.set_text_color(30, 30, 30)
    pdf.cell(0, 8, "Reading Statistics", ln=True)
    pdf.ln(2)

    def stat_row(label, value, color=(30,30,30)):
        pdf.set_font("Helvetica", "", 11)
        pdf.set_text_color(80, 80, 80)
        pdf.cell(90, 8, label)
        pdf.set_font("Helvetica", "B", 11)
        pdf.set_text_color(*color)
        pdf.cell(0, 8, str(value), ln=True)

    minutes = input.duration_seconds // 60
    seconds = input.duration_seconds % 60

    stat_row("Reading Time:", f"{minutes}m {seconds}s")
    stat_row("Reading Speed:", f"{input.reading_speed:.0f} WPM")
    stat_row("Total Paragraphs:", str(input.total_paragraphs))
    stat_row("Difficult Paragraphs:", str(input.difficult_count),
             (220, 50, 50) if input.difficult_count > 0 else (30, 30, 30))
    stat_row("Paragraphs Simplified:", str(input.simplified_count))

    # Focus Score
    pdf.ln(3)
    focus_color = (34, 197, 94) if input.focus_score >= 70 else \
                  (234, 179, 8) if input.focus_score >= 40 else (220, 50, 50)
    stat_row("Focus Score:", f"{input.focus_score:.0f}%", focus_color)

    # Quiz Score
    if input.quiz_total > 0:
        pdf.ln(3)
        pdf.set_font("Helvetica", "B", 13)
        pdf.set_text_color(30, 30, 30)
        pdf.cell(0, 8, "Quiz Results", ln=True)
        pdf.ln(2)
        percentage = round((input.quiz_score / input.quiz_total) * 100)
        quiz_color = (34, 197, 94) if percentage >= 70 else \
                     (234, 179, 8) if percentage >= 40 else (220, 50, 50)
        stat_row("Score:", f"{input.quiz_score}/{input.quiz_total} ({percentage}%)", quiz_color)

    # Recommendations
    pdf.ln(5)
    pdf.set_draw_color(79, 70, 229)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(5)
    pdf.set_font("Helvetica", "B", 13)
    pdf.set_text_color(79, 70, 229)
    pdf.cell(0, 8, "AI Recommendations", ln=True)
    pdf.ln(2)
    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(60, 60, 60)

    if input.focus_score < 50:
        pdf.multi_cell(0, 6, "* Enable Focus Mode to improve concentration while reading.")
    if input.difficult_count > input.total_paragraphs * 0.4:
        pdf.multi_cell(0, 6, "* Many difficult sections found. Try Easy simplification mode.")
    if input.reading_speed < 100:
        pdf.multi_cell(0, 6, "* Reading speed is slow. Use Text-to-Speech at 0.8x speed.")
    if input.quiz_total > 0 and input.quiz_score < input.quiz_total * 0.7:
        pdf.multi_cell(0, 6, "* Quiz score is low. Re-read difficult sections before retrying.")
    if input.focus_score >= 70:
        pdf.multi_cell(0, 6, "* Great focus! Keep up the excellent reading habit.")

    # Footer
    pdf.ln(10)
    pdf.set_font("Helvetica", "I", 9)
    pdf.set_text_color(150, 150, 150)
    pdf.cell(0, 6, "Generated by Cognify AI - Adaptive Reading for Every Mind", align="C")

    # Save to temp file
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
    pdf.output(tmp.name)

    return FileResponse(
        tmp.name,
        media_type="application/pdf",
        filename="cognify_report.pdf"
    )

import threading
import urllib.request
import time

def keep_alive():
    while True:
        time.sleep(840)  # every 14 minutes
        try:
            urllib.request.urlopen('https://cognify-ai-backend-f9iv.onrender.com/health')
        except:
            pass

threading.Thread(target=keep_alive, daemon=True).start()