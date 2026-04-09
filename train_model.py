from app.analyzer.ml_model import LogAnomalyModel

# 🔥 Sample training logs (you can expand later)
logs = [
    "User login successful",
    "Server started successfully",
    "Database connection established",
    "API request completed",
    "Health check passed",

    # anomalies
    "Error connecting to database",
    "Critical failure in API",
    "Unauthorized access attempt detected",
    "Connection timeout occurred",
    "Memory leak detected in system"
]

def main():
    print("🚀 Training ML model...")

    model = LogAnomalyModel()
    model.train(logs)

    print("✅ Model trained and saved successfully!")

if __name__ == "__main__":
    main()