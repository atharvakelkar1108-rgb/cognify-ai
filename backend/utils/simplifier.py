import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))
GROQ_MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-20b")

# Cache to avoid duplicate API calls
_cache = {}

def simplify_sentence(sentence: str, level: str = "Easy") -> str:
    # Check cache first
    cache_key = f"{level}:{sentence[:50]}"
    if cache_key in _cache:
        return _cache[cache_key]

    level_prompts = {
        "Easy": "Simplify for a 10 year old in 1-2 sentences:",
        "Medium": "Simplify in clearer English in 1-2 sentences:",
        "Hard": "Slightly simplify in 1-2 sentences:"
    }

    prompt = f"{level_prompts.get(level, level_prompts['Easy'])}\n{sentence[:500]}\n\nRespond only with the simplified text in one complete sentence or paragraph. Do not add bullets, labels, or extra commentary."

    try:
        response = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[{"role": "user", "content": prompt}],
            # gpt-oss is a reasoning model: low max_tokens can exhaust the
            # budget on thinking and return empty content.
            max_completion_tokens=1024,
            temperature=0.3,
            reasoning_effort="low",
        )
        result = (response.choices[0].message.content or "").strip()
        if not result:
            return "Error simplifying: model returned empty content"
        _cache[cache_key] = result  # Save to cache
        return result
    except Exception as e:
        return f"Error simplifying: {str(e)}"

def explain_sentence(sentence: str, mode: str = "eli5") -> str:
    cache_key = f"{mode}:{sentence[:50]}"
    if cache_key in _cache:
        return _cache[cache_key]

    mode_prompts = {
        "eli5": "Explain in 1-2 simple sentences for a 10 year old:",
        "example": "Give one real life example to explain this:",
        "summary": "Summarize in one simple sentence:"
    }

    prompt = f"{mode_prompts.get(mode, mode_prompts['eli5'])}\n{sentence[:500]}\n\nRespond only with the explanation in simple, complete sentences. Do not add extra bullets or commentary."

    try:
        response = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[{"role": "user", "content": prompt}],
            max_completion_tokens=1024,
            temperature=0.3,
            reasoning_effort="low",
        )
        result = (response.choices[0].message.content or "").strip()
        if not result:
            return "Error explaining: model returned empty content"
        _cache[cache_key] = result
        return result
    except Exception as e:
        return f"Error explaining: {str(e)}"