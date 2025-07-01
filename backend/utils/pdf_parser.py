import fitz  # PyMuPDF

def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return 
if __name__ == "__main__":
    text = extract_text_from_pdf("sample_resume.pdf")
    print(text)
