import nltk
import re
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords

# Download required nltk data
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('averaged_perceptron_tagger')
nltk.download('punkt_tab')

def split_into_sentences(text: str) -> list:
    """Split text into sentences"""
    return sent_tokenize(text)

def get_word_complexity(word: str) -> float:
    """Score word complexity based on length and syllables"""
    word = word.lower()
    # Count syllables roughly
    vowels = "aeiou"
    syllable_count = sum(1 for char in word if char in vowels)
    length_score = len(word) / 10.0
    syllable_score = syllable_count / 5.0
    return (length_score + syllable_score) / 2

def analyze_sentence_difficulty(sentence: str) -> dict:
    """Analyze how difficult a sentence is"""
    words = word_tokenize(sentence)
    words = [w for w in words if w.isalpha()]

    if not words:
        return {"difficulty": 0.0, "complex_words": [], "word_count": 0}

    stop_words = set(stopwords.words('english'))
    content_words = [w for w in words if w.lower() not in stop_words]

    # Calculate complexity scores
    complexity_scores = [get_word_complexity(w) for w in content_words]
    avg_complexity = sum(complexity_scores) / len(complexity_scores) if complexity_scores else 0

    # Find complex words
    complex_words = [w for w, s in zip(content_words, complexity_scores) if s > 0.4]

    # Sentence length score
    length_score = min(len(words) / 20.0, 1.0)

    # Final difficulty score (0 to 1)
    difficulty = (avg_complexity * 0.7) + (length_score * 0.3)

    return {
        "difficulty": round(difficulty, 2),
        "complex_words": complex_words[:5],
        "word_count": len(words)
    }

def process_text(text: str) -> list:
    """Process full text and return sentence analysis"""
    sentences = split_into_sentences(text)
    results = []

    for i, sentence in enumerate(sentences):
        analysis = analyze_sentence_difficulty(sentence)
        results.append({
            "index": i,
            "sentence": sentence,
            "difficulty": analysis["difficulty"],
            "complex_words": analysis["complex_words"],
            "word_count": analysis["word_count"],
            "is_difficult": analysis["difficulty"] > 0.4
        })

    return results