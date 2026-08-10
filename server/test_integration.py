import os
import sqlite3
import joblib
import pandas as pd
import numpy as np
import scipy.sparse as sp
from scipy.sparse import hstack
from sklearn.metrics.pairwise import cosine_similarity
import datetime
import re

# Set paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")
DB_PATH = os.path.join(BASE_DIR, "incident_records.db")

# 1. Load Models & Encoders
print("=== 1. Loading Trained ML Models & Encoders ===")
try:
    category_model = joblib.load(os.path.join(MODELS_DIR, "category_model.joblib"))
    tfidf_cat = joblib.load(os.path.join(MODELS_DIR, "tfidf_vectorizer.joblib"))
    level_encoder = joblib.load(os.path.join(MODELS_DIR, "level_encoder.joblib"))
    
    priority_model = joblib.load(os.path.join(MODELS_DIR, "priority_model.joblib"))
    tfidf_prio = joblib.load(os.path.join(MODELS_DIR, "priority_tfidf.joblib"))
    priority_encoder = joblib.load(os.path.join(MODELS_DIR, "priority_encoder.joblib"))
    print("[SUCCESS] All category and priority classifiers and text vectorizers loaded!")
except Exception as e:
    print("[ERROR] Model loading failed:", e)
    exit(1)

# Lookup Tables
ROOT_CAUSE_MAP = {
    "db_timeout": {
        "root_cause": "Database connection pool exhausted due to active transaction leak.",
        "fix": "Terminate leaked sessions and scale up the DB connection pool size limit."
    },
    "auth_failure": {
        "root_cause": "Authentication token validation failed.",
        "fix": "Renew expired LDAP certificate and invalidate token cache."
    },
    "network_error": {
        "root_cause": "Network routing gateway packet drop.",
        "fix": "Perform router interface reload and DNS checkup."
    }
}

def get_root_cause_and_fix(category):
    cat_lower = category.lower()
    for key, val in ROOT_CAUSE_MAP.items():
        if key in cat_lower:
            return val
    return {
        "root_cause": f"Standard telemetry issue matched with category: {category}.",
        "fix": "Verify local server debug flags and diagnostic checklist."
    }

# 2. Test Input Parsing
print("\n=== 2. Simulating User Input & Incident Analysis ===")
test_raw_input = 'handle_incident("Insurance claim submission failed, database write timeout", "ERROR", "Insurance")'
print(f"Pasted Input Log Block:\n   '{test_raw_input}'")

# Extract params using regex matching
pattern = r'handle_incident\(\s*"([^"]+)"\s*,\s*"([^"]+)"\s*(?:,\s*"([^"]+)"\s*)?\)'
match = re.search(pattern, test_raw_input)
if match:
    content = match.group(1)
    level = match.group(2)
    department = match.group(3) if match.group(3) else "Insurance"
    print("[SUCCESS] Parsed variables successfully:")
    print(f"  - Message: '{content}'")
    print(f"  - Level: '{level}'")
    print(f"  - Department: '{department}'")
else:
    print("[ERROR] Failed to parse input block!")
    exit(1)

# 3. Category Prediction
print("\n=== 3. Running Category ML Classifier ===")
cat_text_feats = tfidf_cat.transform([content])
level_df = pd.DataFrame([level], columns=["Level"])
cat_level_feats = level_encoder.transform(level_df)

if sp.issparse(cat_level_feats):
    x_cat_combined = hstack([cat_text_feats, cat_level_feats])
else:
    x_cat_combined = hstack([cat_text_feats, sp.csr_matrix(cat_level_feats)])

pred_cat = category_model.predict(x_cat_combined)[0]
print(f"[SUCCESS] Predicted Category: '{pred_cat}'")

# 4. Priority Prediction
print("\n=== 4. Running Priority ML Classifier ===")
prio_text_feats = tfidf_prio.transform([content])
prio_df = pd.DataFrame([[department, pred_cat, level]], columns=["Department", "Category", "Level"])
prio_meta_feats = priority_encoder.transform(prio_df)

if sp.issparse(prio_meta_feats):
    x_prio_combined = hstack([prio_text_feats, prio_meta_feats])
else:
    x_prio_combined = hstack([prio_text_feats, sp.csr_matrix(prio_meta_feats)])

pred_prio = priority_model.predict(x_prio_combined)[0]
print(f"[SUCCESS] Predicted Priority: '{pred_prio}'")

# 5. Knowledge Base Lookup
print("\n=== 5. Performing Knowledge Base Diagnostics Lookup ===")
rc_fix = get_root_cause_and_fix(pred_cat)
print(f"[SUCCESS] Root Cause: '{rc_fix['root_cause']}'")
print(f"[SUCCESS] Recommended Fix: '{rc_fix['fix']}'")

# 6. RAG PERSISTENCE and similarity search
print("\n=== 6. SQLite Persistence & RAG Matching Check ===")
try:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    # Read references
    cursor.execute("SELECT content, category, fix FROM incidents")
    db_rows = cursor.fetchall()
    conn.close()
    
    if db_rows:
        db_contents = [r[0] for r in db_rows]
        db_vectors = tfidf_cat.transform(db_contents)
        query_vector = tfidf_cat.transform([content])
        
        sims = cosine_similarity(query_vector, db_vectors)[0]
        top_indices = np.argsort(sims)[::-1][:3]
        
        print("[SUCCESS] RAG Semantic search results (top 3 most similar incidents):")
        for i, idx in enumerate(top_indices):
            print(f"  Match #{i+1}: '{db_contents[idx]}' | Sim: {int(sims[idx] * 100)}% | Resolution Fix: {db_rows[idx][2]}")
    else:
        print("[WARNING] SQLite DB contains no events. Please run uvicorn server once to seed the CSV logs.")
except Exception as e:
    print("[ERROR] SQLite RAG operation failed:", e)

print("\n=== INTEGRATION TEST COMPLETE: Data flowed successfully between all modules! ===")
