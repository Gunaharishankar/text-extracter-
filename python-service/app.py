import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from dotenv import load_dotenv
import uvicorn
from ocr.tesseract import process_image

load_dotenv()

app = FastAPI(title="Transformo Docs OCR Service")

@app.post("/ocr")
async def perform_ocr(file: UploadFile = File(...)):
    try:
        content = await file.read()
        extracted_text, metadata = process_image(content)
        return {
            "success": True,
            "text": extracted_text,
            "metadata": metadata
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
