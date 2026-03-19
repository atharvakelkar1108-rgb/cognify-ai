import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-pro")

def simplify_sentence(sentence: str, level: str = "Easy") -> str:
    """Simplify a sentence based on difficulty level"""
    
    level_prompts = {
        "Easy": "Rewrite this sentence for a 10 year old. Use very simple words and short sentences.",
        "Medium": "Rewrite this sentence in simpler English. Keep it clear and easy to understand.",
        "Hard": "Slightly simplify this sentence while keeping technical terms intact."
    }

    prompt = f"{level_prompts.get(level, level_prompts['Easy'])}\n\nSentence: {sentence}\n\nSimplified:"

    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        return f"Error simplifying: {str(e)}"

def explain_sentence(sentence: str, mode: str = "eli5") -> str:
    """Explain a sentence in different ways"""
    
    mode_prompts = {
        "eli5": "Explain this like I'm 10 years old:",
        "example": "Give a real life example to explain this:",
        "summary": "Summarize this in one simple sentence:"
    }

    prompt = f"{mode_prompts.get(mode, mode_prompts['eli5'])}\n\n{sentence}"

    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        return f"Error explaining: {str(e)}"
    
'''

**Now get your FREE Gemini API key:**

1. Go to **aistudio.google.com**
2. Click **"Get API Key"**
3. Click **"Create API key"**
4. Copy the key

---

**Open `backend/.env` and paste:**
```
GEMINI_API_KEY=your_api_key_here
'''