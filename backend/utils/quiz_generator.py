import os
import json
from dotenv import load_dotenv
from groq import Groq

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def generate_quiz(text: str, num_questions: int = 5) -> list:
    """Generate MCQ quiz from text using Groq AI"""

    prompt = f"""Generate {num_questions} multiple choice questions from this text.

Text: {text}

Rules:
- Each question must have exactly 4 options (A, B, C, D)
- Only one correct answer per question
- Questions should test comprehension
- Make it suitable for ADHD/dyslexia users (clear, simple language)

Respond ONLY with a JSON array like this:
[
  {{
    "question": "What is...?",
    "options": ["A. option1", "B. option2", "C. option3", "D. option4"],
    "correct": "A",
    "explanation": "Brief explanation why A is correct"
  }}
]

Return ONLY the JSON array, no other text."""

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=2000
        )
        
        content = response.choices[0].message.content.strip()
        
        # Clean up response
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()
        
        questions = json.loads(content)
        return questions

    except json.JSONDecodeError:
        return generate_fallback_quiz(text)
    except Exception as e:
        return [{"error": str(e)}]

def generate_fallback_quiz(text: str) -> list:
    """Fallback quiz if AI fails"""
    words = text.split()[:50]
    return [
        {
            "question": "What is the main topic of this text?",
            "options": ["A. Science", "B. History", "C. Technology", "D. The text content"],
            "correct": "D",
            "explanation": "The text discusses its main subject throughout."
        }
    ]

def evaluate_answer(question: dict, user_answer: str) -> dict:
    """Evaluate user's answer"""
    is_correct = user_answer.upper() == question["correct"].upper()
    return {
        "is_correct": is_correct,
        "correct_answer": question["correct"],
        "explanation": question.get("explanation", ""),
        "user_answer": user_answer
    }