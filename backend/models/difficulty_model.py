import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import pickle
import os

class DifficultyModel:
    def __init__(self):
        self.model = RandomForestClassifier(
            n_estimators=100,
            random_state=42
        )
        self.scaler = StandardScaler()
        self.is_trained = False
        self.model_path = "models/difficulty_model.pkl"

    def extract_features(self, sentence_data: dict) -> list:
        """Extract features from sentence analysis"""
        return [
            sentence_data.get("word_count", 0),
            sentence_data.get("difficulty", 0),
            len(sentence_data.get("complex_words", [])),
            sentence_data.get("pause_count", 0),
            sentence_data.get("backtrack_count", 0),
            sentence_data.get("time_spent", 0)
        ]

    def generate_training_data(self):
        """Generate synthetic training data"""
        np.random.seed(42)
        X = []
        y = []

        # Easy sentences (label 0)
        for _ in range(200):
            X.append([
                np.random.randint(3, 10),    # word count
                np.random.uniform(0, 0.3),   # difficulty
                np.random.randint(0, 2),     # complex words
                np.random.randint(0, 1),     # pause count
                0,                           # backtrack count
                np.random.uniform(1, 10)     # time spent
            ])
            y.append(0)  # Easy

        # Medium sentences (label 1)
        for _ in range(200):
            X.append([
                np.random.randint(10, 20),
                np.random.uniform(0.3, 0.6),
                np.random.randint(2, 4),
                np.random.randint(1, 3),
                np.random.randint(0, 2),
                np.random.uniform(10, 25)
            ])
            y.append(1)  # Medium

        # Hard sentences (label 2)
        for _ in range(200):
            X.append([
                np.random.randint(20, 40),
                np.random.uniform(0.6, 1.0),
                np.random.randint(4, 8),
                np.random.randint(3, 6),
                np.random.randint(2, 5),
                np.random.uniform(25, 60)
            ])
            y.append(2)  # Hard

        return np.array(X), np.array(y)

    def train(self):
        """Train the difficulty model"""
        print("Training difficulty model...")
        X, y = self.generate_training_data()
        X_scaled = self.scaler.fit_transform(X)
        self.model.fit(X_scaled, y)
        self.is_trained = True

        # Save model
        with open(self.model_path, "wb") as f:
            pickle.dump({
                "model": self.model,
                "scaler": self.scaler
            }, f)
        print("Model trained and saved!")
        return {"trained": True, "samples": len(X)}

    def load(self):
        """Load saved model"""
        if os.path.exists(self.model_path):
            with open(self.model_path, "rb") as f:
                data = pickle.load(f)
                self.model = data["model"]
                self.scaler = data["scaler"]
                self.is_trained = True
            return True
        return False

    def predict(self, sentence_data: dict) -> dict:
        """Predict difficulty level of a sentence"""
        if not self.is_trained:
            # Try loading saved model
            if not self.load():
                # Train if no saved model
                self.train()

        features = self.extract_features(sentence_data)
        features_scaled = self.scaler.transform([features])
        prediction = self.model.predict(features_scaled)[0]
        probability = self.model.predict_proba(features_scaled)[0]

        labels = {0: "Easy", 1: "Medium", 2: "Hard"}
        return {
            "difficulty_level": labels[prediction],
            "confidence": round(max(probability) * 100, 1),
            "probabilities": {
                "Easy": round(probability[0] * 100, 1),
                "Medium": round(probability[1] * 100, 1),
                "Hard": round(probability[2] * 100, 1)
            }
        }

# Global model instance
difficulty_model = DifficultyModel()