import joblib
import pandas as pd
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")

cat_model = joblib.load(os.path.join(MODELS_DIR, "category_model.joblib"))
tfidf_cat = joblib.load(os.path.join(MODELS_DIR, "tfidf_vectorizer.joblib"))

prio_model = joblib.load(os.path.join(MODELS_DIR, "priority_model.joblib"))
tfidf_prio = joblib.load(os.path.join(MODELS_DIR, "priority_tfidf.joblib"))

text = ["Patient having severe breathing issues"]

try:
    x_cat = tfidf_cat.transform(text)
    print("Cat TFIDF features:", x_cat.shape)
    cat_model.predict(x_cat)
    print("Category predict success")
except Exception as e:
    print("Category predict fail:", e)

try:
    x_prio = tfidf_prio.transform(text)
    print("Prio TFIDF features:", x_prio.shape)
    prio_model.predict(x_prio)
    print("Priority predict success")
except Exception as e:
    print("Priority predict fail:", e)
