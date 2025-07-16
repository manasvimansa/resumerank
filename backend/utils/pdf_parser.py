import fitz  # PyMuPDF

def extract_text_from_pdf(pdf_path):
    """
    Extracts and returns the full text content from a PDF file.

    Args:
        pdf_path (str): Path to the PDF file.

    Returns:
        str: Extracted text from the entire PDF.
    """
    text = ""
<<<<<<< HEAD
    for page in doc:
        text += page.get_text()
    return 

=======
    try:
        doc = fitz.open(pdf_path)
        for page in doc:
            text += page.get_text()
        doc.close()
    except Exception as e:
        print(f"Error reading PDF: {e}")
    
    return text
>>>>>>> 04e53ec5 (Your message describing the changes)
