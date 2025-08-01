import spacy
import os
from spacy.lang.en.stop_words import STOP_WORDS
from string import punctuation
from heapq import nlargest
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Load spaCy and skills.txt here
nlp = spacy.load("en_core_web_sm")

with open("skills.txt") as f:
    skill_list = [line.strip().lower() for line in f.readlines()]
skill_set = set(skill_list)

def extract_skills(text):
    doc = nlp(text.lower())
    extracted = set()
    for chunk in doc.noun_chunks:
        chunk_text = chunk.text.strip().lower()
        if chunk_text in skill_set:
            extracted.add(chunk_text)
    for token in doc:
        if token.text in skill_set:
            extracted.add(token.text)
    return extracted

def extract_keywords(text):
    doc = nlp(text)
    return {
        token.text.lower()
        for token in doc
        if token.pos_ in ("NOUN", "PROPN") and not token.is_stop and token.is_alpha
    }

def extract_entities(text):
    doc = nlp(text)
    return [(ent.text, ent.label_) for ent in doc.ents]

def extract_name(text):
    doc = nlp(text)
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            return ent.text
    return "Unknown"


def summarize_text(text, n=3):
    doc = nlp(text)
    word_freq = {}
    for word in doc:
        w = word.text.lower()
        if w not in STOP_WORDS and w not in punctuation:
            word_freq[w] = word_freq.get(w, 0) + 1

    sentence_strength = {}
    for sent in doc.sents:
        for word in sent:
            w = word.text.lower()
            if w in word_freq:
                sentence_strength[sent] = sentence_strength.get(sent, 0) + word_freq[w]

    top_sentences = nlargest(n, sentence_strength, key=sentence_strength.get)
    return " ".join([str(s) for s in top_sentences])

def extract_top_n_keywords(text, n=10):
    vectorizer = TfidfVectorizer(stop_words="english", max_features=1000)
    tfidf_matrix = vectorizer.fit_transform([text])
    feature_names = vectorizer.get_feature_names_out()
    scores = tfidf_matrix.toarray().flatten()
    top_n = sorted(zip(feature_names, scores), key=lambda x: -x[1])[:n]
    return {k for k, _ in top_n}

def get_similarity_score(text1, text2):
    vectorizer = TfidfVectorizer(stop_words="english")
    vectors = vectorizer.fit_transform([text1, text2])
    return cosine_similarity(vectors[0], vectors[1])[0][0]

def calculate_resume_score(resume_text, job_text):
    resume_skills = extract_skills(resume_text)
    job_skills = extract_skills(job_text)

    if not job_skills:
        skill_score = 0.0
    else:
        skill_score = len(resume_skills & job_skills) / len(job_skills)

    similarity_score = get_similarity_score(resume_text, job_text)

    experience_score = 1.0 if any(
        phrase in resume_text.lower() for phrase in ["2 years", "3 years", "experience", "work history", "employed at"]
    ) else 0.5

    education_score = 1.0 if any(
        phrase in resume_text.lower() for phrase in ["b.tech", "bachelor", "graduation", "degree", "bachelor of technology"]
    ) else 0.0

    return (0.5 * skill_score) + (0.2 * similarity_score) + (0.2 * experience_score) + (0.1 * education_score)

def process_resume(resume_path, job_description):
    if not os.path.exists(resume_path):
        return {"error": "File not found."}

    resume_text = extract_text_from_pdf(resume_path)
    skills_found = extract_skills(resume_text)
    name = extract_name(resume_text)

    return {
        "resume_text_preview": resume_text[:1000],
        "skills": list(skills_found),
        "name": name
    }

import fitz  # PyMuPDF

def extract_text_from_pdf(pdf_path):
    """
    Extracts text from a PDF file using PyMuPDF.
    """
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text


def get_resume_score(resume_text, job_description):
    score = calculate_resume_score(resume_text, job_description)
    return round(score, 2)


