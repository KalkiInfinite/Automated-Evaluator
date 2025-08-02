# evaluator.py
import language_tool_python
from sentence_transformers import SentenceTransformer, util
import numpy as np
import pdfplumber
import re

tool = language_tool_python.LanguageTool('en-US')
model = SentenceTransformer('all-MiniLM-L6-v2')

def extract_qa_from_pdf(pdf_path):
    with pdfplumber.open(pdf_path) as pdf:
        full_text = "\n".join([page.extract_text() for page in pdf.pages if page.extract_text()])

    pattern = r"(Q\d+:\s*.+?\?)\s*Ans:\s*(.+?)(?=(Q\d+:|$))"
    qa_matches = re.findall(pattern, full_text, re.DOTALL)

    qa_pairs = []
    for idx, (question, answer, _) in enumerate(qa_matches):
        qa_pairs.append({
            "question": question.strip(),
            "student_answer": answer.strip()
        })
    return qa_pairs

def evaluate_answer(student_answer, keywords, model_answer):
    ans_lower = student_answer.lower()
    matched_keywords = sum(1 for k in keywords if k.strip() in ans_lower)
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