from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pdfplumber
import re
import language_tool_python
from sentence_transformers import SentenceTransformer, util
import numpy as np
import easyocr
from pdf2image import convert_from_path
from uuid import uuid4

app = Flask(__name__)
CORS(app)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load language tool and sentence transformer model
tool = language_tool_python.LanguageTool('en-US')
model = SentenceTransformer('all-MiniLM-L6-v2')

# Extract student answers from typed PDFs
def extract_qa_from_pdf(pdf_path):
    with pdfplumber.open(pdf_path) as pdf:
        full_text = "\n".join([page.extract_text() for page in pdf.pages if page.extract_text()])
    pattern = r"(Q\d+:\s*.+?\?)\s*Ans:\s*(.+?)(?=(Q\d+:|$))"
    qa_matches = re.findall(pattern, full_text, re.DOTALL)

    return [
        {"question": q.strip(), "student_answer": a.strip()}
        for q, a, _ in qa_matches
    ]

# Extract ideal answers and keywords from typed PDFs
def extract_ideal_from_pdf(pdf_path):
    with pdfplumber.open(pdf_path) as pdf:
        full_text = "\n".join([page.extract_text() for page in pdf.pages if page.extract_text()])
    pattern = r"(Q\d+:\s*.+?\?)\s*Ans:\s*(.+?)\s*Keywords:\s*(.+?)(?=(Q\d+:|$))"
    qa_matches = re.findall(pattern, full_text, re.DOTALL)

    return [
        {
            "question": q.strip(),
            "model_answer": a.strip(),
            "keywords": [k.strip().lower() for k in keywords.split(",") if k.strip()]
        }
        for q, a, keywords, _ in qa_matches
    ]

# Extract OCR text from scanned handwritten PDFs
def extract_text_from_handwritten_pdf(pdf_path):
    reader = easyocr.Reader(['en'])
    images = convert_from_path(pdf_path)
    full_text = ""
    for img in images:
        result = reader.readtext(np.array(img), detail=0, paragraph=True)
        full_text += " ".join(result) + "\n"
    return full_text

# Parse OCR text into Q&A pairs
def extract_qa_from_ocr_text(text):
    pattern = r"(Q\d+:\s*.+?\?)\s*Ans:\s*(.+?)(?=(Q\d+:|$))"
    qa_matches = re.findall(pattern, text, re.DOTALL)

    return [
        {"question": q.strip(), "student_answer": a.strip()}
        for q, a, _ in qa_matches
    ]

# Core scoring logic
def evaluate_answer(student_answer, keywords, model_answer):
    ans_lower = student_answer.lower()
    matched_keywords = sum(1 for k in keywords if k in ans_lower)
    keyword_score = matched_keywords / len(keywords) * 4 if keywords else 0

    matches = tool.check(student_answer)
    num_errors = len(matches)
    grammar_score = max(0, (1 - num_errors / max(1, len(student_answer.split()))) * 3)

    emb1 = model.encode(student_answer, convert_to_tensor=True)
    emb2 = model.encode(model_answer, convert_to_tensor=True)
    similarity = util.pytorch_cos_sim(emb1, emb2).item()
    semantic_score = min(similarity, 1.0) * 3

    final_score = round(keyword_score + grammar_score + semantic_score, 2)

    return {
        "keywordScore": round(keyword_score, 2),
        "grammarScore": round(grammar_score, 2),
        "semanticScore": round(semantic_score, 2),
        "finalScore": final_score
    }

# Route for PDF Evaluation (typed or handwritten)
@app.route("/evaluate-pdf", methods=["POST"])
def evaluate_pdf():
    student_pdf = request.files.get("pdf")
    ideal_pdf = request.files.get("ideal_pdf")
    is_handwritten = request.form.get("handwritten", "false").lower() == "true"

    if not student_pdf or not ideal_pdf:
        return jsonify({"error": "Both student and ideal answer PDFs are required."}), 400

    unique_id = uuid4().hex
    student_path = os.path.join(UPLOAD_FOLDER, f"student_{unique_id}.pdf")
    ideal_path = os.path.join(UPLOAD_FOLDER, f"ideal_{unique_id}.pdf")
    student_pdf.save(student_path)
    ideal_pdf.save(ideal_path)

    try:
        if is_handwritten:
            raw_text = extract_text_from_handwritten_pdf(student_path)
            student_qa = extract_qa_from_ocr_text(raw_text)
        else:
            student_qa = extract_qa_from_pdf(student_path)

        ideal_qa = extract_ideal_from_pdf(ideal_path)

        if len(student_qa) != len(ideal_qa):
            return jsonify({"error": "Mismatch in number of questions between student and ideal PDFs."}), 400

        results = []
        for i in range(len(student_qa)):
            s = student_qa[i]
            m = ideal_qa[i]
            result = evaluate_answer(s["student_answer"], m["keywords"], m["model_answer"])
            result.update({"question": s["question"], "student_answer": s["student_answer"]})
            results.append(result)

        return jsonify({"results": results})

    finally:
        if os.path.exists(student_path):
            os.remove(student_path)
        if os.path.exists(ideal_path):
            os.remove(ideal_path)

# Route for manual input
@app.route("/evaluate", methods=["POST"])
def evaluate():
    data = request.json
    answers = data.get("answers", [])
    keywords = data.get("keywords", [])
    model_answer = data.get("modelAnswer", "")

    results = []
    for ans in answers:
        result = evaluate_answer(ans, keywords, model_answer)
        results.append(result)

    return jsonify({"results": results})

if __name__ == "__main__":
    app.run(debug=True)
