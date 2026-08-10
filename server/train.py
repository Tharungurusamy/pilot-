import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import LinearSVC
from sklearn.preprocessing import LabelEncoder
import joblib
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")
DATA_DIR = os.path.join(BASE_DIR, "../scratch/HospitalLM")

df = pd.read_csv(os.path.join(DATA_DIR, "final_training_dataset_v5.csv"))

# Drop NaNs
df = df.dropna(subset=['Content', 'category', 'Level'])

# Train Category Model
tfidf_cat = TfidfVectorizer()
X_cat = tfidf_cat.fit_transform(df['Content'])
level_enc = LabelEncoder()
y_cat = level_enc.fit_transform(df['category'])
cat_model = LinearSVC()
cat_model.fit(X_cat, y_cat)

joblib.dump(tfidf_cat, os.path.join(MODELS_DIR, "tfidf_vectorizer.joblib"))
joblib.dump(level_enc, os.path.join(MODELS_DIR, "level_encoder.joblib"))
joblib.dump(cat_model, os.path.join(MODELS_DIR, "category_model.joblib"))

# Train Priority Model (Using 'Level')
tfidf_prio = TfidfVectorizer()
X_prio = tfidf_prio.fit_transform(df['Content'])
prio_enc = LabelEncoder()
y_prio = prio_enc.fit_transform(df['Level'])
prio_model = LinearSVC()
prio_model.fit(X_prio, y_prio)

joblib.dump(tfidf_prio, os.path.join(MODELS_DIR, "priority_tfidf.joblib"))
joblib.dump(prio_enc, os.path.join(MODELS_DIR, "priority_encoder.joblib"))
joblib.dump(prio_model, os.path.join(MODELS_DIR, "priority_model.joblib"))

print("Retraining completed and models saved.")
