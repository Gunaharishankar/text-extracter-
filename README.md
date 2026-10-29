# Transformo Docs

Transformo Docs is a full-stack document text extraction application. It allows users to upload documents (PDF, DOCX, PPTX, XLSX, JPG, PNG, TXT, etc.) and extracts machine-readable text from them. It intelligently routes extraction tasks to either Apache Tika (for digital documents) or a Python OCR service running Tesseract (for scanned documents and images).

## Architecture

*   **Frontend:** React, Vite, CSS, Axios
*   **Backend:** Node.js, Express, Multer, Mongoose
*   **Database:** MongoDB
*   **OCR Service:** Python, FastAPI, Tesseract OCR, Pillow
*   **Document Parsing:** Apache Tika Server

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB running locally on port `27017`
- Python 3.8+
- Tesseract OCR installed on your system
- Apache Tika Server running locally on port `9998`

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```
*Runs on http://localhost:5000*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Runs on http://localhost:5173*

### 3. Python OCR Service Setup
```bash
cd python-service
# Create and activate a virtual environment (optional but recommended)
python -m venv venv
# On Windows: venv\Scripts\activate
# On Mac/Linux: source venv/bin/activate

pip install -r requirements.txt
uvicorn app:app --reload
```
*Runs on http://localhost:8000*

### 4. Apache Tika Setup
You can run Apache Tika via Docker or download the jar.
```bash
# Docker example
docker run -d -p 9998:9998 apache/tika
```
