from datetime import datetime
from typing import List, Dict

class BehaviorTracker:
    def __init__(self):
        self.sessions = {}

    def start_session(self, user_id: str, text: str) -> dict:
        """Start a new reading session"""
        self.sessions[user_id] = {
            "start_time": datetime.now().isoformat(),
            "text": text,
            "paragraphs": {},
            "total_pauses": 0,
            "backtrack_count": 0,
            "scroll_events": []
        }
        return {"session_started": True, "user_id": user_id}

    def track_event(self, user_id: str, event: dict) -> dict:
        """Track a reading behavior event"""
        if user_id not in self.sessions:
            return {"error": "Session not found"}

        session = self.sessions[user_id]
        event_type = event.get("type")
        paragraph_index = event.get("paragraph_index", 0)

        # Initialize paragraph tracking
        if paragraph_index not in session["paragraphs"]:
            session["paragraphs"][paragraph_index] = {
                "time_spent": 0,
                "pause_count": 0,
                "backtrack_count": 0,
                "visits": 0
            }

        para = session["paragraphs"][paragraph_index]

        if event_type == "pause":
            para["pause_count"] += 1
            para["time_spent"] += event.get("duration", 0)
            session["total_pauses"] += 1

        elif event_type == "backtrack":
            para["backtrack_count"] += 1
            session["backtrack_count"] += 1

        elif event_type == "visit":
            para["visits"] += 1

        session["scroll_events"].append({
            "type": event_type,
            "paragraph": paragraph_index,
            "timestamp": datetime.now().isoformat()
        })

        return {"tracked": True}

    def get_difficult_paragraphs(self, user_id: str) -> List[int]:
        """Identify difficult paragraphs based on behavior"""
        if user_id not in self.sessions:
            return []

        difficult = []
        for idx, para in self.sessions[user_id]["paragraphs"].items():
            # Paragraph is difficult if:
            # - More than 2 pauses OR
            # - Any backtracking OR
            # - Spent more than 30 seconds
            if (para["pause_count"] > 2 or
                para["backtrack_count"] > 0 or
                    para["time_spent"] > 30):
                difficult.append(idx)

        return difficult

    def get_cognitive_profile(self, user_id: str) -> dict:
        """Generate cognitive profile for user"""
        if user_id not in self.sessions:
            return {}

        session = self.sessions[user_id]
        paragraphs = session["paragraphs"]

        if not paragraphs:
            return {"message": "Not enough data yet"}

        total_time = sum(p["time_spent"] for p in paragraphs.values())
        total_pauses = session["total_pauses"]
        total_backtracks = session["backtrack_count"]
        difficult_count = len(self.get_difficult_paragraphs(user_id))

        # Calculate focus score (0-100)
        focus_score = max(0, 100 - (total_pauses * 5) - (total_backtracks * 10))

        # Reading speed estimate
        word_count = len(session["text"].split())
        reading_speed = (word_count / total_time * 60) if total_time > 0 else 0

        return {
            "focus_score": round(focus_score, 1),
            "reading_speed_wpm": round(reading_speed, 1),
            "total_pauses": total_pauses,
            "total_backtracks": total_backtracks,
            "difficult_paragraphs": difficult_count,
            "total_time_seconds": round(total_time, 1)
        }

# Global tracker instance
tracker = BehaviorTracker()