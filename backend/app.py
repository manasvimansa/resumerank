# app.py

from flask import Flask, request, jsonify
from flask_cors import CORS 
import os
app = Flask(__name__)
CORS(app)

# Basic Setup ──────────────────────────────────────────────────────
app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# /extract_skills Endpoint ─────────────────────────────────────────
@app.route("/extract_skills", methods=["POST"])
def extract_skills_route():
    data = request.get_json()
    if not data or "resume_text" not in data:
        return jsonify({"error": "resume_text is required"}), 400

    skills = extract_skills(data["resume_text"])
    return jsonify({"skills": list(skills)})

# extract_keywords Endpoint ───────────────────────────────────────
@app.route("/extract_keywords", methods=["POST"])
def extract_keywords_route():
    data = request.get_json()
    if not data or "text" not in data:
        return jsonify({"error": "text is required"}), 400

    keywords = extract_keywords(data["text"])
    return jsonify({"keywords": list(keywords)})

# extract_entities Endpoint ───────────────────────────────────────
@app.route("/extract_entities", methods=["POST"])
def extract_entities_route():
    data = request.get_json()
    if not data or "text" not in data:
        return jsonify({"error": "text is required"}), 400

    entities = extract_entities(data["text"])
    return jsonify({"entities": entities})

# summarize Endpoint ─────────────────────────────────────────────
@app.route("/summarize", methods=["POST"])
def summarize_route():
    data = request.get_json()
    if not data or "text" not in data:
        return jsonify({"error": "text is required"}), 400

    n_sentences = data.get("n", 3)
    summary = summarize_text(data["text"], n_sentences)
    return jsonify({"summary": summary})

# match_skills Endpoint ───────────────────────────────────────────
@app.route("/match_skills", methods=["POST"])
def match_skills_route():
    data = request.get_json()
    if not data or "job_description" not in data or "resume_text" not in data:
        return jsonify({"error": "job_description and resume_text are required"}), 400

    jd = data["job_description"]
    rt = data["resume_text"]
    jd_skills = extract_skills(jd)
    resume_skills = extract_skills(rt)
    matched = jd_skills & resume_skills
    skill_score = len(matched) / len(jd_skills) if jd_skills else 0.0

    return jsonify({
        "job_skills": list(jd_skills),
        "resume_skills": list(resume_skills),
        "matched_skills": list(matched),
        "skill_score": round(skill_score, 2)
    })

# resume_score Endpoint ───────────────────────────────────────────
@app.route("/resume_score", methods=["POST"])
def resume_score_route():
    data = request.get_json()
    if not data or "resume_text" not in data or "job_description" not in data:
        return jsonify({"error": "resume_text and job_description are required"}), 400

    final_score = calculate_resume_score(data["resume_text"], data["job_description"])
    return jsonify({"final_score": round(final_score, 2)})

# /upload Endpoint (PDF + Job Desc) ───────────────────────────────
@app.route("/upload", methods=["POST"])
def upload_resume():
    if "resume" not in request.files or "job_description" not in request.form:
        return jsonify({"error": "Missing 'resume' file or 'job_description'"}), 400

    resume_file = request.files["resume"]
    job_description = request.form["job_description"]

    if resume_file.filename == "":
        return jsonify({"error": "No file selected."}), 400

    saved_path = os.path.join(UPLOAD_FOLDER, resume_file.filename)
    resume_file.save(saved_path)

    result = process_resume(saved_path, job_description)

    try:
        os.remove(saved_path)
    except OSError:
        pass

    return jsonify(result)

#  Run the App ──────────────────────────────────────────────────────
if __name__ == "__main__":
    app.run(debug=True)
