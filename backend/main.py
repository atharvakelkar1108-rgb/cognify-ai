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