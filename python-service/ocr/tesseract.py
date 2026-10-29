import pytesseract
from PIL import Image
import io

# Explicitly set the path for Windows environments
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def process_image(image_bytes):
    try:
        # Load image using Pillow
        image = Image.open(io.BytesIO(image_bytes))
        
        # Simple extraction for now (grayscale/thresholding can be added later in preprocessing.py)
        text = pytesseract.image_to_string(image)
        
        metadata = {
            "format": image.format,
            "mode": image.mode,
            "size": image.size,
            "ocr_engine": "tesseract"
        }
        
        return text.strip(), metadata
    except Exception as e:
        print(f"OCR Error: {str(e)}")
        raise Exception("Failed to process image with Tesseract")
