import re

# ── Keyword Banks ──────────────────────────────────────────────────────────────

KEYWORD_GROUPS = {
    "Critical system failure": [
        "error", "failed", "failure", "critical", "fatal",
        "panic", "crash", "exception", "segmentation fault",
        "core dumped", "out of memory", "oom", "heap overflow",
        "stack overflow", "kernel panic",
    ],
    "Security threat": [
        "unauthorized", "forbidden", "access denied",
        "invalid token", "authentication failed",
        "permission denied", "csrf attack", "xss",
        "sql injection", "malware detected", "breach",
        "suspicious login", "multiple failed login",
    ],
    "Network issue": [
        "timeout", "connection refused", "connection reset",
        "dns failure", "host unreachable", "gateway timeout",
        "bad gateway", "service unavailable",
        "network unreachable", "ssl error", "tls handshake failed",
    ],
    "Database error": [
        "database error", "db failure", "query failed",
        "deadlock", "connection pool exhausted",
        "transaction rollback", "syntax error",
        "duplicate entry", "foreign key constraint",
        "cannot connect to database",
    ],
    "Performance degradation": [
        "high latency", "slow response", "timeout exceeded",
        "cpu usage high", "memory leak", "disk full",
        "resource exhaustion", "thread blocked",
        "rate limit exceeded", "throttling",
    ],
}

HTTP_ERROR_PATTERNS = [r"\b5\d{2}\b", r"\b4\d{2}\b"]

ADVANCED_PATTERNS = [
    (r"failed\s+\w+",              "Repeated-failure pattern"),
    (r"error\s+\d+",               "Numeric error code"),
    (r"exception\s+\w+",           "Exception type detected"),
    (r"retrying\s+\d+",            "Retry loop detected"),
    (r"too many requests",         "Rate limiting triggered"),
    (r"service .* down",           "Service down pattern"),
    (r"unable to [\w\s]+",         "Unable-to pattern"),
    (r"no such file or directory", "Missing file/resource"),
    (r"broken pipe",               "Broken pipe"),
    (r"disk quota exceeded",       "Disk quota exceeded"),
]


# ── Public API ─────────────────────────────────────────────────────────────────

def detect_rule_based(log: str) -> bool:
    anomaly, _ = explain_rule_based(log)
    return anomaly


def explain_rule_based(log: str):
    """Returns (is_anomaly: bool, reasons: list[str])."""
    log_lower = log.lower()
    reasons = []

    for group_name, keywords in KEYWORD_GROUPS.items():
        matched = [kw for kw in keywords if kw in log_lower]
        if matched:
            reasons.append(f"{group_name} — keyword(s): {', '.join(matched[:3])}")

    for pattern, label in ADVANCED_PATTERNS:
        if re.search(pattern, log_lower):
            reasons.append(f"Pattern match: {label}")

    for pat in HTTP_ERROR_PATTERNS:
        m = re.search(pat, log)
        if m:
            reasons.append(f"HTTP error code detected: {m.group()}")

    return bool(reasons), reasons
