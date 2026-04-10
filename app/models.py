from datetime import datetime
import json
from app import db


class Log(db.Model):
    __tablename__ = "logs"

    id            = db.Column(db.Integer, primary_key=True)
    message       = db.Column(db.Text, nullable=False)
    level         = db.Column(db.String(20), default="INFO")
    anomaly       = db.Column(db.Boolean, default=False)
    anomaly_score = db.Column(db.Float, default=0.0)
    category      = db.Column(db.String(50))
    source        = db.Column(db.String(100))
    severity      = db.Column(db.String(20), default="LOW")
    reasons       = db.Column(db.Text, default="[]")
    timestamp     = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id":            self.id,
            "message":       self.message,
            "level":         self.level,
            "anomaly":       self.anomaly,
            "anomaly_score": round(self.anomaly_score or 0.0, 3),
            "category":      self.category,
            "source":        self.source,
            "severity":      self.severity or "LOW",
            "reasons":       json.loads(self.reasons or "[]"),
            "timestamp":     self.timestamp.isoformat(),
        }


class AlertIncident(db.Model):
    __tablename__ = "alert_incidents"

    id          = db.Column(db.Integer, primary_key=True)
    title       = db.Column(db.String(300), nullable=False)
    category    = db.Column(db.String(50))
    severity    = db.Column(db.String(20), default="LOW")
    status      = db.Column(db.String(20), default="OPEN")
    count       = db.Column(db.Integer, default=1)
    first_seen  = db.Column(db.DateTime, default=datetime.utcnow)
    last_seen   = db.Column(db.DateTime, default=datetime.utcnow)
    source      = db.Column(db.String(100))
    score       = db.Column(db.Float, default=0.0)
    notes       = db.Column(db.Text, default="")
    fingerprint = db.Column(db.String(64))

    def to_dict(self):
        return {
            "id":          self.id,
            "title":       self.title,
            "category":    self.category,
            "severity":    self.severity,
            "status":      self.status,
            "count":       self.count,
            "first_seen":  self.first_seen.isoformat(),
            "last_seen":   self.last_seen.isoformat(),
            "source":      self.source,
            "score":       round(self.score or 0.0, 3),
            "notes":       self.notes or "",
            "fingerprint": self.fingerprint,
        }


class AppSettings(db.Model):
    __tablename__ = "app_settings"

    id    = db.Column(db.Integer, primary_key=True)
    key   = db.Column(db.String(100), unique=True, nullable=False)
    value = db.Column(db.Text)

    _DEFAULTS = {
        "ml_enabled":         "true",
        "rule_enabled":       "true",
        "sensitivity":        "0.5",
        "alert_threshold":    "0.7",
        "log_retention_days": "30",
        "theme":              "dark",
        "alert_console":      "true",
        "alert_email":        "false",
        "alert_slack":        "false",
    }

    @classmethod
    def get(cls, key, default=None):
        s = cls.query.filter_by(key=key).first()
        return s.value if s else (default if default is not None else cls._DEFAULTS.get(key))

    @classmethod
    def set_value(cls, key, value):
        s = cls.query.filter_by(key=key).first()
        if s:
            s.value = str(value)
        else:
            db.session.add(cls(key=key, value=str(value)))
        db.session.commit()

    @classmethod
    def get_all(cls):
        result = dict(cls._DEFAULTS)
        for s in cls.query.all():
            result[s.key] = s.value
        return result
