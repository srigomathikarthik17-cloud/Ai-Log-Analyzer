import datetime
import hashlib


def _fingerprint(log_data: dict) -> str:
    key = f"{log_data.get('category','')}-{log_data.get('source','')}-{log_data.get('severity','')}"
    return hashlib.md5(key.encode()).hexdigest()[:16]


def group_alert(log_data: dict):
    """Group similar anomalies into deduplicated incident records."""
    try:
        from app import db
        from app.models import AlertIncident

        fp  = _fingerprint(log_data)
        now = datetime.datetime.utcnow()
        cutoff = now - datetime.timedelta(hours=1)

        existing = (
            AlertIncident.query
            .filter_by(fingerprint=fp)
            .filter(
                AlertIncident.status.in_(["OPEN", "INVESTIGATING"]),
                AlertIncident.last_seen >= cutoff,
            )
            .first()
        )

        if existing:
            existing.count    += 1
            existing.last_seen = now
            if log_data.get("score", 0) > (existing.score or 0):
                existing.score    = log_data["score"]
                existing.severity = log_data.get("severity", existing.severity)
        else:
            incident = AlertIncident(
                title       = log_data.get("message", "Unknown")[:200],
                category    = log_data.get("category", "general"),
                severity    = log_data.get("severity", "LOW"),
                status      = "OPEN",
                count       = 1,
                first_seen  = now,
                last_seen   = now,
                source      = log_data.get("source", "unknown"),
                score       = log_data.get("score", 0.0),
                fingerprint = fp,
            )
            db.session.add(incident)

        db.session.commit()

    except Exception as exc:
        print(f"Alert grouping error: {exc}")


def send_alert(log_data: dict):
    if not log_data.get("anomaly"):
        return
    severity = get_severity(log_data.get("score", 0))
    print(format_alert(log_data, severity))


def get_severity(score: float) -> str:
    if score >= 0.9:   return "CRITICAL"
    elif score >= 0.75: return "HIGH"
    elif score >= 0.5:  return "MEDIUM"
    return "LOW"


def format_alert(log_data: dict, severity: str) -> str:
    return (
        f"\n🚨 ALERT\n"
        f"Severity : {severity}\n"
        f"Category : {log_data.get('category')}\n"
        f"Source   : {log_data.get('source')}\n"
        f"Score    : {log_data.get('score')}\n"
        f"Message  : {log_data.get('message')}\n"
    )
