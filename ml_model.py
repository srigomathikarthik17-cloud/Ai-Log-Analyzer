import os
import pickle
from sklearn.ensemble import IsolationForest
from sklearn.feature_extraction.text import TfidfVectorizer
from scipy.sparse import csr_matrix
BASE_DIR = os.path.dirname(__file__)

MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")
VECTORIZER_PATH = os.path.join(BASE_DIR, "vectorizer.pkl")
class LogAnomalyModel:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(max_features=500)
        self.model = IsolationForest(
            contamination=0.1,
            random_state=42
        )
        self.is_trained = False

    def train(self, logs):
        print("🚀 Training started...")

        X = self.vectorizer.fit_transform(logs)
        X = csr_matrix(X)

        self.model.fit(X)

        # 🔥 Ensure directory exists
        os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)

            # 🔥 Save model
        with open(MODEL_PATH, "wb") as f:
            pickle.dump(self.model, f)

        with open(VECTORIZER_PATH, "wb") as f:
            pickle.dump(self.vectorizer, f)

        print("✅ Model saved at:", MODEL_PATH)
        print("✅ Vectorizer saved at:", VECTORIZER_PATH)
    def load(self):
        try:
            if os.path.exists(MODEL_PATH) and os.path.exists(VECTORIZER_PATH):
                with open(MODEL_PATH, "rb") as f:
                    self.model = pickle.load(f)

                with open(VECTORIZER_PATH, "rb") as f:
                    self.vectorizer = pickle.load(f)

                self.is_trained = True
                print("✅ ML model loaded successfully")

            else:
                print("⚠️ Model files not found. Train first.")

        except Exception as e:
            print("❌ Model load error:", e)
            self.is_trained = False

    
    def predict(self, log):
        if not self.is_trained:
            return {
                "anomaly": False,
                "score": 0.0,
                "source": "ml_not_ready"
            }

        X = self.vectorizer.transform([log])
        X = csr_matrix(X)

        prediction = self.model.predict(X)

        anomaly = prediction[0] == -1
        score = 0.8 if anomaly else 0.2

        return {
            "anomaly": anomaly,
            "score": score,
            "source": "ml_model"
        }