from flask import Flask, request, jsonify
import joblib
import re
from underthesea import word_tokenize
from flask_cors import CORS

model_dir = "./models"
vectorizer = joblib.load(f"{model_dir}/vectorizer_mbti.pkl")
truc_labels = ['IE', 'NS', 'TF', 'JP']
models = {label: joblib.load(f"{model_dir}/model_{label}.pkl") for label in truc_labels}

stopwords = {
    "là", "và", "của", "những", "các", "tôi", "bạn", "một", "được", "có", "này", "đó", "vì", "thì", "khi",
    "chúng", "ta", "hay", "với", "trong", "ra", "sẽ", "rằng", "vẫn", "như", "đã", "nên", "hơn", "nào", "thật", "rất", "làm"
}

def tien_xu_ly(text):
    text = re.sub(r"http\S+", "", text)
    text = re.sub(r"[^\w\s]", "", text)
    text = text.lower()
    tokens = word_tokenize(text, format="text")
    words = [w for w in tokens.split() if w not in stopwords]
    return " ".join(words)

def du_doan_mbti_full(van_ban):
    van_ban = tien_xu_ly(van_ban)
    vec = vectorizer.transform([van_ban])
    return "".join(models[label].predict(vec)[0] for label in truc_labels)

app = Flask(__name__)
CORS(app)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    if "text" not in data:
        return jsonify({"error": "Missing 'text' field"}), 400
    text = data["text"]
    result = du_doan_mbti_full(text)
    return jsonify({"mbti": result})

if __name__ == "__main__":
    app.run(debug=True)
