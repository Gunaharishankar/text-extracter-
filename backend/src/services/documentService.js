const tikaService = require('./tikaService');
const ocrService = require('./ocrService');
const Document = require('../models/Document');

class DocumentService {
    
    determineExtractionMethod(mimeType) {
        if (mimeType.startsWith('image/')) {
            return 'ocr';
        }
        // Assuming PDF, DOCX, etc., go to Tika
        return 'tika';
    }

    async processDocument(documentId) {
        const doc = await Document.findById(documentId);
        if (!doc) {
            throw new Error('Document not found');
        }

        try {
            doc.status = 'processing';
            await doc.save();

            const method = this.determineExtractionMethod(doc.mimeType);
            doc.extractionMethod = method;

            let extractedText = '';
            let metadata = {};

            if (method === 'tika') {
                extractedText = await tikaService.extractText(doc.filePath);
                try {
                    metadata = await tikaService.extractMetadata(doc.filePath);
                } catch (e) {
                    console.log("Metadata extraction failed, continuing...");
                }
            } else if (method === 'ocr') {
                const ocrResult = await ocrService.extractText(doc.filePath);
                extractedText = ocrResult.text;
                metadata = ocrResult.metadata || {};
            }

            doc.extractedText = extractedText;
            doc.metadata = metadata;
            doc.status = 'completed';
            await doc.save();

            return doc;
        } catch (error) {
            console.error(`Error processing document ${documentId}:`, error);
            doc.status = 'failed';
            await doc.save();
            throw error;
        }
    }
}

module.exports = new DocumentService();
