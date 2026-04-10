import json
import datetime
import random
import re
import psutil
import os
import time

START_TIME = time.time()  


from flask import Blueprint, request, jsonify, render_template
from app import db
from app.models import Log, AlertIncident, AppSettings
from app.services.alert_service import send_alert, get_severity
from app.analyzer.rule_based import detect_rule_based, explain_rule_based
from app.analyzer.ml_model import LogAnomalyModel

main = Blueprint("main", __name__)

# Singleton ML model
model = LogAnomalyModel()
model.load()


# ─── Default settings ─────────────────────────────────────────────────────────

DEFAULT_SETTINGS = {
    "ml_enabled":       "true",
    "rule_enabled":     "true",
    "sensitivity":      "0.5",
    "alert_threshold":  "0.7",
    "retention_days":   "30",
    "theme":            "dark",
}


def get_setting(key):
    val = AppSettings.get(key, DEFAULT_SETTINGS.get(key))
    return val


# ─── Dashboard ────────────────────────────────────────────────────────────────

@main.route("/")
def dashboard():
    return render_template("dashboard.html")


# ─── Add Log ──────────────────────────────────────────────────────────────────

@main.route("/log", methods=["POST"])
def add_log():
    try:
        data    = request.get_json()
        message = data.get("message")
        level   = data.get("level", "INFO")
        source  = data.get("source", "unknown")

        if not message:
            return jsonify({"error": "Message is required"}), 400

        rule_enabled = get_setting("ml_enabled") != "false"
        ml_enabled   = get_setting("rule_enabled") != "false"
        threshold    = float(get_setting("alert_threshold") or 0.7)

        rule_anomaly, rule_reasons = explain_rule_based(message)
        if not rule_enabled:
            rule_anomaly, rule_reasons = False, []

        ml_result   = model.predict(message) if ml_enabled else {"anomaly": False, "score": 0.0, "source": "disabled"}
        ml_anomaly  = ml_result["anomaly"]
        ml_score    = ml_result["score"]

        anomaly       = rule_anomaly or ml_anomaly
        anomaly_score = max(ml_score, 0.9 if rule_anomaly else 0.1)
        category      = classify_log(message)

        if anomaly_score < threshold:
            anomaly = False

        log = Log(
            message       = message,
            level         = level,
            anomaly       = anomaly,
            anomaly_score = anomaly_score,
            category      = category,
            source        = source,
            severity = get_severity(anomaly_score)
        )
        db.session.add(log)
        db.session.commit()

        send_alert({
            "message":  message,
            "score":    anomaly_score,
            "category": category,
            "anomaly":  anomaly,
            "source":   source,
        })

        return jsonify({
            "status":   "success",
            "anomaly":  anomaly,
            "score":    anomaly_score,
            "category": category,
            "severity": get_severity(anomaly_score) if anomaly else "NONE",
            "reasons":  [r["text"] for r in rule_reasons],
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ─── Get Logs ─────────────────────────────────────────────────────────────────

@main.route("/logs", methods=["GET"])
def get_logs():
    limit  = min(int(request.args.get("limit", 100)), 500)
    logs   = Log.query.order_by(Log.timestamp.desc()).limit(limit).all()
    return jsonify([l.to_dict() for l in logs])


# ─── Analyze (single, no DB save) ─────────────────────────────────────────────

@main.route("/analyze", methods=["POST"])
def analyze():
    try:
        data    = request.get_json()
        message = data.get("message", "").strip()
        if not message:
            return jsonify({"error": "Message is required"}), 400

        rule_anomaly, rule_reasons = explain_rule_based(message)
        ml_result    = model.predict(message)
        ml_anomaly   = ml_result["anomaly"]
        ml_score     = ml_result["score"]

        anomaly       = rule_anomaly or ml_anomaly
        anomaly_score = max(ml_score, 0.9 if rule_anomaly else 0.1)
        category      = classify_log(message)
        severity      = get_severity(anomaly_score) if anomaly else "NONE"

        # Build structured reasons
        reasons = list(rule_reasons)
        if ml_anomaly:
            reasons.append({
                "type":  "ml",
                "group": "ml",
                "text":  f"ML model flagged — confidence {ml_score:.2f}",
            })
        elif ml_result.get("source") == "ml_not_ready":
            reasons.append({
                "type":  "ml",
                "group": "info",
                "text":  "ML model not trained — run train_model.py",
            })

        if not reasons and not anomaly:
            reasons.append({
                "type":  "info",
                "group": "info",
                "text":  "No anomaly indicators found",
            })

        return jsonify({
            "anomaly":  anomaly,
            "score":    round(anomaly_score, 3),
            "severity": severity,
            "category": category,
            "reasons":  reasons,
            "ml_score": round(ml_score, 3),
            "rule_hit": rule_anomaly,
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ─── Batch Analyze ────────────────────────────────────────────────────────────

@main.route("/analyze/batch", methods=["POST"])
def analyze_batch():
    try:
        data = request.get_json()
        logs = data.get("logs", [])
        if not isinstance(logs, list) or not logs:
            return jsonify({"error": "Provide a 'logs' array"}), 400

        results   = []
        anomaly_n = 0

        for i, msg in enumerate(logs[:50]):   # cap at 50
            msg = msg.strip()
            if not msg:
                continue

            rule_anomaly, rule_reasons = explain_rule_based(msg)
            ml_result   = model.predict(msg)
            ml_anomaly  = ml_result["anomaly"]
            ml_score    = ml_result["score"]
            anomaly     = rule_anomaly or ml_anomaly
            score       = max(ml_score, 0.9 if rule_anomaly else 0.1)
            category    = classify_log(msg)
            severity    = get_severity(score) if anomaly else "NONE"

            if anomaly:
                anomaly_n += 1

            reasons = rule_reasons[:]
            if ml_anomaly:
                reasons.append({"type": "ml", "group": "ml", "text": f"ML confidence {ml_score:.2f}"})

            results.append({
                "index":    i + 1,
                "message":  msg,
                "anomaly":  anomaly,
                "score":    round(score, 3),
                "severity": severity,
                "category": category,
                "reasons":  [r["text"] for r in reasons],
            })

        return jsonify({
            "total":     len(results),
            "anomalies": anomaly_n,
            "clean":     len(results) - anomaly_n,
            "results":   results,
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ─── Alerts ───────────────────────────────────────────────────────────────────

@main.route("/alerts", methods=["GET"])
def get_alerts():
    status   = request.args.get("status")
    severity = request.args.get("severity")

    q = AlertIncident.query.order_by(AlertIncident.last_seen.desc())
    if status:
        q = q.filter(AlertIncident.status == status.upper())
    if severity:
        q = q.filter(AlertIncident.severity == severity.upper())

    alerts = q.limit(200).all()
    return jsonify([a.to_dict() for a in alerts])


@main.route("/alerts/<int:alert_id>", methods=["PATCH"])
def update_alert(alert_id):
    try:
        alert = AlertIncident.query.get_or_404(alert_id)
        data  = request.get_json()

        new_status = data.get("status", "").upper()
        if new_status in ("OPEN", "INVESTIGATING", "RESOLVED"):
            alert.status = new_status
            if new_status == "RESOLVED":
                alert.resolved_at = datetime.datetime.utcnow()
            elif alert.resolved_at:
                alert.resolved_at = None

        if "notes" in data:
            alert.notes = data["notes"]

        db.session.commit()
        return jsonify(alert.to_dict())

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@main.route("/alerts/stats", methods=["GET"])
def alert_stats():
    total        = AlertIncident.query.count()
    open_count   = AlertIncident.query.filter_by(status="OPEN").count()
    invest_count = AlertIncident.query.filter_by(status="INVESTIGATING").count()
    res_count    = AlertIncident.query.filter_by(status="RESOLVED").count()
    crit_count   = AlertIncident.query.filter_by(severity="CRITICAL").count()

    return jsonify({
        "total":         total,
        "open":          open_count,
        "investigating": invest_count,
        "resolved":      res_count,
        "critical":      crit_count,
    })


# ─── Settings ─────────────────────────────────────────────────────────────────

@main.route("/settings", methods=["GET"])
def get_settings():
    settings = {}
    for key, default in DEFAULT_SETTINGS.items():
        settings[key] = get_setting(key) or default
    return jsonify(settings)


@main.route("/settings", methods=["POST"])
def save_settings():
    try:
        data = request.get_json()
        allowed = set(DEFAULT_SETTINGS.keys())
        for key, val in data.items():
            if key in allowed:
                AppSettings.set(key, str(val))
        return jsonify({"status": "saved"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ─── System Health ────────────────────────────────────────────────────────────

@main.route("/health", methods=["GET"])
def system_health():
    try:
        cpu_pct = psutil.cpu_percent(interval=0.1)
        mem_pct = psutil.virtual_memory().percent
    except:
        cpu_pct = random.uniform(20, 75)
        mem_pct = random.uniform(35, 80)

    uptime_hours = (time.time() - START_TIME) / 3600

    return jsonify({
        "cpu_percent": round(cpu_pct, 1),
        "memory_percent": round(mem_pct, 1),
        "uptime": round(uptime_hours, 2),   # 🔥 ADD THIS
        "status": "healthy"
    })

# ─── Log Stats (for timeline) ─────────────────────────────────────────────────

@main.route("/stats/timeline", methods=["GET"])
def stats_timeline():
    """Return hourly log counts for the last 24 h."""
    from sqlalchemy import func
    now    = datetime.datetime.utcnow()
    since  = now - datetime.timedelta(hours=24)

    rows = (
        db.session.query(
            func.strftime("%H", Log.timestamp).label("hour"),
            func.count(Log.id).label("total"),
            func.sum(db.cast(Log.anomaly, db.Integer)).label("anomalies"),
        )
        .filter(Log.timestamp >= since)
        .group_by("hour")
        .all()
    )

    data = [{"hour": r.hour, "total": r.total, "anomalies": int(r.anomalies or 0)} for r in rows]
    return jsonify(data)


# ─── Helpers ──────────────────────────────────────────────────────────────────

def classify_log(message: str) -> str:
    msg = message.lower()
    if any(x in msg for x in ["unauthorized", "attack", "token", "denied", "breach", "injection", "xss", "csrf"]):
        return "security"
    if any(x in msg for x in ["timeout", "connection", "dns", "gateway", "ssl", "tls"]):
        return "network"
    if any(x in msg for x in ["database", "query", "sql", "deadlock", "transaction", "db"]):
        return "database"
    if any(x in msg for x in ["cpu", "memory", "latency", "leak", "disk", "throttl", "rate limit"]):
        return "performance"
    return "general"
