from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from typing import List, Optional
import joblib
import pandas as pd
import numpy as np
import os
import re
import datetime
import scipy.sparse as sp
from scipy.sparse import hstack
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
from sklearn.metrics.pairwise import cosine_similarity
import urllib.request
import json
import threading

def trigger_webhook_async(incidents_list):
    def send_post():
        log_file = os.path.join(BASE_DIR, "webhook.log")
        try:
            url = "https://api.agents.snsihub.ai/webhook-test/incident"
            payload = {
                "events": [
                    {
                        "timestamp": inc.get("timestamp") or datetime.datetime.now().strftime("%H:%M:%S"),
                        "level": inc.get("level"),
                        "department": inc.get("department"),
                        "content": inc.get("content"),
                        "traceId": inc.get("traceId") or "TRC-NEW",
                        "category": inc.get("category"),
                        "priority": inc.get("priority"),
                        "root_cause": inc.get("root_cause"),
                        "fix": inc.get("fix")
                    } for inc in incidents_list
                ]
            }
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode('utf-8'),
                headers={'Content-Type': 'application/json', 'User-Agent': 'MediWatch-AI-Webhook-Client'}
            )
            with urllib.request.urlopen(req, timeout=5) as response:
                status_code = response.getcode()
                msg = f"[{datetime.datetime.now().isoformat()}] Webhook post success. Code: {status_code}\n"
                with open(log_file, "a") as f:
                    f.write(msg)
                print(msg.strip(), flush=True)
        except Exception as e:
            msg = f"[{datetime.datetime.now().isoformat()}] Webhook post failed: {e}\n"
            with open(log_file, "a") as f:
                f.write(msg)
            print(msg.strip(), flush=True)

    t = threading.Thread(target=send_post, daemon=True)
    t.start()

app = FastAPI(title="HospitalLM ML Analytics API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")

class SinglePredictionRequest(BaseModel):
    content: str
    level: str
    department: str

class BatchLogEntry(BaseModel):
    timestamp: Optional[str] = None
    level: str
    department: str
    content: str
    traceId: Optional[str] = None

class BatchPredictionRequest(BaseModel):
    logs: List[BatchLogEntry]

class RawLogsRequest(BaseModel):
    raw_text: str

models = {}

@app.on_event("startup")
def load_models():
    try:
        # Load Category models
        models["category_model"] = joblib.load(os.path.join(MODELS_DIR, "category_model.joblib"))
        models["tfidf_cat"] = joblib.load(os.path.join(MODELS_DIR, "tfidf_vectorizer.joblib"))
        models["level_encoder"] = joblib.load(os.path.join(MODELS_DIR, "level_encoder.joblib"))
        
        # Load Priority models
        models["priority_model"] = joblib.load(os.path.join(MODELS_DIR, "priority_model.joblib"))
        models["tfidf_prio"] = joblib.load(os.path.join(MODELS_DIR, "priority_tfidf.joblib"))
        models["priority_encoder"] = joblib.load(os.path.join(MODELS_DIR, "priority_encoder.joblib"))
        
        # Initialize DB
        init_db()
        print("All models and RAG database loaded successfully.")
    except Exception as e:
        print(f"Error loading models: {e}")

# Category-specific Root Cause and Recommended Action (Fix) Lookup Table
ROOT_CAUSE_MAP = {
    "db_timeout": {
        "root_cause": "Database connection pool exhausted due to active transaction leak in pharmacy-service controller.",
        "fix": "Terminate leaked sessions by running 'SELECT pg_terminate_backend(pid) FROM pg_stat_activity' and increase pool sizing."
    },
    "auth_failure": {
        "root_cause": "Authentication failed. Identity provider service LDAP certificate expired, invalidating user verification loops.",
        "fix": "Renew expired LDAP certificate immediately, flush token refresh caches, and restart auth-gateway."
    },
    "deploy_regression": {
        "root_cause": "Regression introduced in latest application deployment package. Null pointer / serialization mismatch.",
        "fix": "Initiate automated rollback of the current backend deployment to git version HEAD~1, check syntax guidelines."
    },
    "network_error": {
        "root_cause": "Network connection DNS resolution failure. Gateway switch trunking/routing rules misconfigured.",
        "fix": "Restart local systemd-resolved DNS daemon on host nodes and re-sync switch port VLAN designations."
    },
    "resource_exhaustion": {
        "root_cause": "JVM memory heap capacity warning. Container instance terminated by Kubernetes due to out-of-memory exception.",
        "fix": "Verify JVM memory parameters (-Xmx2048m), scale nodes horizontally, and review logs for memory leak patterns."
    },
    "exception_error": {
        "root_cause": "Unhandled exception encountered in runtime core thread handler logic.",
        "fix": "Review code trace trace details, add validation checks for null elements, and push minor patch release."
    },
    "normal": {
        "root_cause": "System operation normal. No issues flagged.",
        "fix": "No corrective Action needed."
    }
}

DB_PATH = os.path.join(BASE_DIR, "incident_records.db")

def init_db():
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS incidents (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT,
                level TEXT,
                department TEXT,
                content TEXT,
                category TEXT,
                priority TEXT,
                root_cause TEXT,
                fix TEXT
            )
        """)
        conn.commit()
        
        cursor.execute("SELECT COUNT(*) FROM incidents")
        count = cursor.fetchone()[0]
        if count == 0:
            csv_path = os.path.join(BASE_DIR, "..", "scratch", "HospitalLM", "hospital_logs.csv")
            if os.path.exists(csv_path):
                import csv
                with open(csv_path, 'r', encoding='utf-8') as f:
                    reader = csv.DictReader(f)
                    to_insert = []
                    for row in reader:
                        content = row.get("content", "")
                        dept = "Pharmacy"
                        if "PACS" in content.upper() or "LAB" in content.upper() or "RESULT" in content.upper():
                            dept = "Lab"
                        elif "LOGIN" in content.upper() or "AUTHENTICATE" in content.upper() or "CREDENTIAL" in content.upper():
                            dept = "EMR Login"
                        
                        to_insert.append((
                            datetime.datetime.now().strftime("%H:%M:%S"),
                            "ERROR" if "error" in content.lower() or "fail" in content.lower() else "INFO",
                            dept,
                            content,
                            row.get("category", "unknown"),
                            "P2",
                            row.get("root_cause", ""),
                            row.get("fix", "")
                        ))
                    cursor.executemany("""
                        INSERT INTO incidents (timestamp, level, department, content, category, priority, root_cause, fix)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    """, to_insert)
                    conn.commit()
        conn.close()
    except Exception as e:
        print("Error initializing SQLite database:", e)

def save_incident_to_db(level: str, department: str, content: str, category: str, priority: str, root_cause: str, fix: str):
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO incidents (timestamp, level, department, content, category, priority, root_cause, fix)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            datetime.datetime.now().strftime("%H:%M:%S"),
            level,
            department,
            content,
            category,
            priority,
            root_cause,
            fix
        ))
        conn.commit()
        conn.close()
    except Exception as e:
        print("Error saving log to SQLite DB:", e)

def semantic_rag_search(query_content: str, k: int = 3):
    if not models.get("tfidf_cat") or not os.path.exists(DB_PATH):
        return []
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT id, timestamp, level, department, content, category, priority, root_cause, fix FROM incidents")
        rows = cursor.fetchall()
        conn.close()
        
        if not rows:
            return []
            
        contents = [row[4] for row in rows]
        
        tfidf = models["tfidf_cat"]
        history_vectors = tfidf.transform(contents)
        query_vector = tfidf.transform([query_content])
        
        similarities = cosine_similarity(query_vector, history_vectors)[0]
        
        # Sort similarity indices in descending order
        top_indices = np.argsort(similarities)[::-1][:k]
        
        results = []
        for idx in top_indices:
            sim = float(similarities[idx])
            # Only return matches with standard similarity
            row = rows[idx]
            results.append({
                "id": row[0],
                "timestamp": row[1],
                "level": row[2],
                "department": row[3],
                "content": row[4],
                "category": row[5],
                "priority": row[6],
                "root_cause": row[7],
                "fix": row[8],
                "similarity": f"{int(sim * 100)}%"
            })
        return results
    except Exception as e:
        print("Error execution semantic RAG search:", e)
        return []

def get_root_cause_and_fix(category: str):
    cat_lower = category.lower()
    for key, value in ROOT_CAUSE_MAP.items():
        if key in cat_lower:
            return value
    return {
        "root_cause": f"Identified standard issue corresponding to {category}.",
        "fix": "Inspect runtime logs and check service telemetry markers."
    }

def run_ml_pipeline(content: str, level: str, department: str):
    if not models.get("category_model"):
        raise ValueError("ML models not initialized.")

    # 1. Predict Category
    # Content TF-IDF
    cat_text_feats = models["tfidf_cat"].transform([content])
    # Level One-Hot
    level_df = pd.DataFrame([level], columns=["Level"])
    cat_level_feats = models["level_encoder"].transform(level_df)
    
    # Concatenate features
    if sp.issparse(cat_level_feats):
        x_cat_combined = hstack([cat_text_feats, cat_level_feats])
    else:
        x_cat_combined = hstack([cat_text_feats, sp.csr_matrix(cat_level_feats)])
        
    pred_cat_encoded = models["category_model"].predict(x_cat_combined)
    category_label = pred_cat_encoded[0]

    # 2. Predict Priority
    # Content TF-IDF for priority
    prio_text_feats = models["tfidf_prio"].transform([content])
    # Department, Category, Level One-Hot
    prio_df = pd.DataFrame([[department, category_label, level]], columns=["Department", "Category", "Level"])
    prio_meta_feats = models["priority_encoder"].transform(prio_df)
    
    # Concatenate features
    if sp.issparse(prio_meta_feats):
        x_prio_combined = hstack([prio_text_feats, prio_meta_feats])
    else:
        x_prio_combined = hstack([prio_text_feats, sp.csr_matrix(prio_meta_feats)])
        
    pred_prio_encoded = models["priority_model"].predict(x_prio_combined)
    priority_label = pred_prio_encoded[0]

    # Look up Root Cause & Fix
    rc_fix = get_root_cause_and_fix(category_label)

    return {
        "category": category_label,
        "priority": priority_label,
        "root_cause": rc_fix["root_cause"],
        "fix": rc_fix["fix"]
    }

def parse_log_line(line: str, index: int = 1):
    trimmed = line.strip()
    if not trimmed:
        return None
        
    # Heuristics parsing
    level = "INFO"
    department = "Pharmacy"
    content = trimmed
    timestamp = (datetime.datetime.now() - datetime.timedelta(seconds=(100 - index) * 10)).strftime("%H:%M:%S")
    trace_id = f"TRC-{index * 133 + 1289}"

    upper_line = trimmed.upper()
    
    # Log Level Heuristics
    if "FATAL" in upper_line:
        level = "FATAL"
    elif "CRITICAL" in upper_line:
        level = "FATAL"
    elif "ERROR" in upper_line or "FAIL" in upper_line or "ERR" in upper_line:
        level = "ERROR"
    elif "WARN" in upper_line or "WARNING" in upper_line:
        level = "WARN"
    elif "INFO" in upper_line:
        level = "INFO"
        
    # Department Heuristics
    depts = ['Billing', 'EMR Login', 'Emergency Ward', 'ICU', 'Insurance', 'Lab', 'Pharmacy']
    for d in depts:
        if d.upper() in upper_line:
            department = d
            break
            
    # Try finding timestamp in log line like HH:MM:SS
    time_match = re.search(r'\b\d{2}:\d{2}:\d{2}\b', trimmed)
    if time_match:
        timestamp = time_match.group(0)

    # Try finding Trace ID
    trace_match = re.search(r'\bTRC-\d+\b|\bTX-\d+\b|\btrace[-_]?id[:\s]+([a-zA-Z0-9]+)\b', trimmed, re.IGNORECASE)
    if trace_match:
        trace_id = trace_match.group(0)

    # Clean Content text to remove prefixes (like date, level, component)
    clean_message = trimmed
    # Remove dates/times
    clean_message = re.sub(r'^\d{4}[-/]\d{2}[-/]\d{2}\s+\d{2}:\d{2}:\d{2}(?:\.\d+)?\s*', '', clean_message)
    clean_message = re.sub(r'^\b\d{2}:\d{2}:\d{2}\b\s*', '', clean_message)
    # Remove labels like [ERROR], ERROR:, [Pharmacy]
    clean_message = re.sub(r'^\[?(?:ERROR|WARN|INFO|FATAL|DEBUG|CRITICAL|WARNING)\]?[:\-\s]*', '', clean_message, flags=re.IGNORECASE)
    clean_message = re.sub(r'^\[?(?:Pharmacy|Lab|Billing|ICU|EMR Login|Emergency Ward|Insurance)\]?[:\-\s]*', '', clean_message, flags=re.IGNORECASE)
    
    # If the clean message is too short, fall back to trimmed line
    if len(clean_message.strip()) > 5:
        content = clean_message.strip()

    return {
        "timestamp": timestamp,
        "level": level,
        "department": department,
        "content": content,
        "traceId": trace_id
    }

@app.post("/predict")
def predict_single(request: SinglePredictionRequest):
    if not models.get("category_model"):
        raise HTTPException(status_code=500, detail="Models are not loaded on server.")
    try:
        res = run_ml_pipeline(request.content, request.level, request.department)
        
        # RAG Local Cosine Similarity Search
        rag_matches = semantic_rag_search(request.content)
        
        # Save to SQLite Database
        save_incident_to_db(
            level=request.level,
            department=request.department,
            content=request.content,
            category=res["category"],
            priority=res["priority"],
            root_cause=res["root_cause"],
            fix=res["fix"]
        )
        
        result_payload = {
            "content": request.content,
            "level": request.level,
            "department": request.department,
            "category": res["category"],
            "priority": res["priority"],
            "root_cause": res["root_cause"],
            "fix": res["fix"],
            "similar_incidents": rag_matches
        }
        
        # Trigger Remote Webhook
        trigger_webhook_async([result_payload])
        
        return result_payload
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict-batch")
def predict_batch(request: BatchPredictionRequest):
    if not models.get("category_model"):
        raise HTTPException(status_code=500, detail="Models are not loaded on server.")
    
    results = []
    for idx, entry in enumerate(request.logs):
        try:
            res = run_ml_pipeline(entry.content, entry.level, entry.department)
            rag_matches = semantic_rag_search(entry.content)
            save_incident_to_db(
                level=entry.level,
                department=entry.department,
                content=entry.content,
                category=res["category"],
                priority=res["priority"],
                root_cause=res["root_cause"],
                fix=res["fix"]
            )
            results.append({
                "timestamp": entry.timestamp or datetime.datetime.now().strftime("%H:%M:%S"),
                "level": entry.level,
                "department": entry.department,
                "content": entry.content,
                "traceId": entry.traceId or f"TRC-{idx * 133 + 1289}",
                "category": res["category"],
                "priority": res["priority"],
                "root_cause": res["root_cause"],
                "fix": res["fix"],
                "similar_incidents": rag_matches
            })
        except Exception as e:
            results.append({
                "timestamp": entry.timestamp or datetime.datetime.now().strftime("%H:%M:%S"),
                "level": entry.level,
                "department": entry.department,
                "content": entry.content,
                "traceId": entry.traceId or f"TRC-{idx * 133 + 1289}",
                "category": "error",
                "priority": "P4",
                "root_cause": f"Prediction failed: {str(e)}",
                "fix": "Verify features syntax.",
                "similar_incidents": []
            })
    trigger_webhook_async(results)
    return results

@app.post("/predict-raw")
def predict_raw_text(request: RawLogsRequest):
    if not models.get("category_model"):
        raise HTTPException(status_code=500, detail="Models are not loaded on server.")
    
    raw_text = request.raw_text
    results = []
    parsed_count = 0
    
    # 1. Look for matches of parenthesized tuples: (content, level, [department], [category])
    pattern = r"\(\s*['\"]([\s\S]*?)['\"]\s*,\s*['\"]([\s\S]*?)['\"]\s*(?:,\s*['\"]([\s\S]*?)['\"]\s*)?(?:,\s*['\"]([\s\S]*?)['\"]\s*)?\)"
    matches = []
    if "handle_incident" in raw_text:
        matches = re.findall(pattern, raw_text)
    
    if matches:
        for match in matches:
            parsed_count += 1
            content = match[0].strip()
            level = match[1].strip()
            department = match[2].strip() if len(match) > 2 and match[2] else ""
            
            # Guess department if empty
            if not department:
                upper_content = content.upper()
                guess_map = {
                    "PACS": "Lab",
                    "RADIOLOGY": "Lab",
                    "IMAGE": "Lab",
                    "DICOM": "Lab",
                    "SSO": "EMR Login",
                    "LOGIN": "EMR Login",
                    "CREDENTIALS": "EMR Login",
                    "PAYMENT": "Billing",
                    "INVOICE": "Billing",
                    "BILL": "Billing",
                    "PHARMACY": "Pharmacy",
                    "DRUG": "Pharmacy",
                    "PG-POOL": "Pharmacy",
                    "POSTGRES": "Pharmacy",
                    "DB": "Pharmacy",
                    "DATABASE": "Pharmacy",
                    "ICU": "ICU",
                    "VENTILATOR": "ICU",
                    "INSURANCE": "Insurance",
                    "CLAIM": "Insurance",
                    "SWITCH": "Lab",
                }
                
                found_dept = False
                for token, dept in guess_map.items():
                    if token in upper_content:
                        department = dept
                        found_dept = True
                        break
                        
                if not found_dept:
                    depts = ['Billing', 'EMR Login', 'Emergency Ward', 'ICU', 'Insurance', 'Lab', 'Pharmacy']
                    for d in depts:
                        if d.upper() in upper_content:
                            department = d
                            found_dept = True
                            break
                            
                if not found_dept:
                    department = "Pharmacy"
            
            timestamp = (datetime.datetime.now() - datetime.timedelta(seconds=(100 - parsed_count) * 10)).strftime("%H:%M:%S")
            trace_id = f"TRC-{parsed_count * 133 + 1289}"
            
            try:
                res = run_ml_pipeline(content, level, department)
                rag_matches = semantic_rag_search(content)
                save_incident_to_db(
                    level=level,
                    department=department,
                    content=content,
                    category=res["category"],
                    priority=res["priority"],
                    root_cause=res["root_cause"],
                    fix=res["fix"]
                )
                results.append({
                    "timestamp": timestamp,
                    "level": level,
                    "department": department,
                    "content": content,
                    "traceId": trace_id,
                    "category": res["category"],
                    "priority": res["priority"],
                    "root_cause": res["root_cause"],
                    "fix": res["fix"],
                    "similar_incidents": rag_matches
                })
            except Exception as e:
                results.append({
                    "timestamp": timestamp,
                    "level": level,
                    "department": department,
                    "content": content,
                    "traceId": trace_id,
                    "category": "error",
                    "priority": "P4",
                    "root_cause": f"Prediction failed: {str(e)}",
                    "fix": "Verify details.",
                    "similar_incidents": []
                })
    else:
        # Fall back to line-by-line parsing
        lines = raw_text.strip().split('\n')
        for line in lines:
            if not line.strip():
                continue
            parsed_count += 1
            parsed = parse_log_line(line, parsed_count)
            if not parsed:
                continue
                
            try:
                res = run_ml_pipeline(parsed["content"], parsed["level"], parsed["department"])
                rag_matches = semantic_rag_search(parsed["content"])
                save_incident_to_db(
                    level=parsed["level"],
                    department=parsed["department"],
                    content=parsed["content"],
                    category=res["category"],
                    priority=res["priority"],
                    root_cause=res["root_cause"],
                    fix=res["fix"]
                )
                results.append({
                    "timestamp": parsed["timestamp"],
                    "level": parsed["level"],
                    "department": parsed["department"],
                    "content": parsed["content"],
                    "traceId": parsed["traceId"],
                    "category": res["category"],
                    "priority": res["priority"],
                    "root_cause": res["root_cause"],
                    "fix": res["fix"],
                    "similar_incidents": rag_matches
                })
            except Exception as e:
                results.append({
                    "timestamp": parsed["timestamp"],
                    "level": parsed["level"],
                    "department": parsed["department"],
                    "content": parsed["content"],
                    "traceId": parsed["traceId"],
                    "category": "error",
                    "priority": "P4",
                    "root_cause": f"Prediction failed: {str(e)}",
                    "fix": "Verify details.",
                    "similar_incidents": []
                })
    
    trigger_webhook_async(results)
    return results

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
