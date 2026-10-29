const axios = require('axios');
const fs = require('fs');

class TikaService {
    constructor() {
        this.tikaUrl = process.env.TIKA_SERVER_URL || 'http://localhost:9998';
    }

    async extractText(filePath) {
        try {
            const fileBuffer = fs.readFileSync(filePath);
            const response = await axios.put(`${this.tikaUrl}/tika`, fileBuffer, {
                headers: {
                    'Accept': 'text/plain',
                    'Content-Type': 'application/octet-stream'
                },
                maxBodyLength: Infinity,
                maxContentLength: Infinity
            });
            return response.data;
        } catch (error) {
            console.error('Tika text extraction error:', error.message);
            throw new Error('Failed to extract text using Tika');
        }
    }

    async extractMetadata(filePath) {
        try {
            const fileBuffer = fs.readFileSync(filePath);
            const response = await axios.put(`${this.tikaUrl}/meta`, fileBuffer, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/octet-stream'
                },
                maxBodyLength: Infinity,
                maxContentLength: Infinity
            });
            return response.data;
        } catch (error) {
            console.error('Tika metadata extraction error:', error.message);
            throw new Error('Failed to extract metadata using Tika');
        }
    }
}

module.exports = new TikaService();
