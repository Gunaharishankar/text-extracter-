const storageService = require('../services/storageService');
const Document = require('../models/Document');
const documentService = require('../services/documentService');

exports.uploadDocument = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded or unsupported file type.'
            });
        }

        const newDocument = new Document({
            userId: req.user._id,
            originalName: req.file.originalname,
            storedName: req.file.filename,
            fileType: req.file.originalname.split('.').pop(),
            mimeType: req.file.mimetype,
            fileSize: req.file.size,
            filePath: req.file.path,
            status: 'uploaded'
        });

        await newDocument.save();

        // Queue processing asynchronously
        documentService.processDocument(newDocument._id).catch(err => {
            console.error('Background processing error:', err);
        });

        res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            data: newDocument
        });
    } catch (error) {
        next(error);
    }
};

exports.getDocuments = async (req, res, next) => {
    try {
        const documents = await Document.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: documents });
    } catch (error) {
        next(error);
    }
};

exports.getDocument = async (req, res, next) => {
    try {
        const document = await Document.findOne({ _id: req.params.id, userId: req.user._id });
        if (!document) {
            return res.status(404).json({ success: false, message: 'Document not found' });
        }
        res.status(200).json({ success: true, data: document });
    } catch (error) {
        next(error);
    }
};

exports.getDocumentText = async (req, res, next) => {
    try {
        const document = await Document.findOne({ _id: req.params.id, userId: req.user._id });
        if (!document) {
            return res.status(404).json({ success: false, message: 'Document not found' });
        }
        res.status(200).json({ success: true, text: document.extractedText });
    } catch (error) {
        next(error);
    }
};

exports.deleteDocument = async (req, res, next) => {
    try {
        const document = await Document.findOne({ _id: req.params.id, userId: req.user._id });
        if (!document) {
            return res.status(404).json({ success: false, message: 'Document not found' });
        }

        try {
            await storageService.deleteFile(document.filePath);
        } catch (fileErr) {
            console.warn('Physical file deletion warning:', fileErr.message);
        }

        await Document.deleteOne({ _id: req.params.id, userId: req.user._id });

        res.status(200).json({ success: true, message: 'Document deleted successfully' });
    } catch (error) {
        next(error);
    }
};
