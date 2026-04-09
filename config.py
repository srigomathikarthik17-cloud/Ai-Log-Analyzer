import os

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")

    # Database
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL", "sqlite:///database.db"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # ML Config
    MODEL_PATH = os.getenv("MODEL_PATH", "app/analyzer/model.pkl")
    VECTORIZER_PATH = os.getenv("VECTORIZER_PATH", "app/analyzer/vectorizer.pkl")

    # Logging / Monitoring
    LOG_LEVEL = "INFO"
    ALERT_ENABLED = True