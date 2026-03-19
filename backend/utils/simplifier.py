import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def simplify_sentence(sentence: str, level: str = "Easy") -> str:
    level_prompts = {
        "Easy": "Rewrite this for a 10 year old. Use very simple words.",
        "Medium": "Rewrite this in simpler English. Keep it clear.",
        "Hard": "Slightly simplify this while keeping technical terms."
    }

    prompt = f"{level_prompts.get(level, level_prompts['Easy'])}\n\nText: {sentence}\n\nSimplified:"

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"Error simplifying: {str(e)}"

def explain_sentence(sentence: str, mode: str = "eli5") -> str:
    mode_prompts = {
        "eli5": "Explain this like I'm 10 years old:",
        "example": "Give a real life example to explain this:",
        "summary": "Summarize this in one simple sentence:"
    }

    prompt = f"{mode_prompts.get(mode, mode_prompts['eli5'])}\n\n{sentence}"

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"Error explaining: {str(e)}"