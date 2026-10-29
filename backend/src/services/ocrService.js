const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

class OCRService {
    constructor() {
        this.pythonServiceUrl = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';
    }

    async extractText(filePath) {
        try {
            const formData = new FormData();
            formData.append('file', fs.createReadStream(filePath));

            const response = await axios.post(`${this.pythonServiceUrl}/ocr`, formData, {
                headers: {
                    ...formData.getHeaders()
                }
            });
            
            return response.data;
        } catch (error) {
            console.error('Python OCR extraction error:', error.message);
            throw new Error('Failed to extract text using Python OCR service');
        }
    }
}

module.exports = new OCRService();
