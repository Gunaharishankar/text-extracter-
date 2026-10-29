const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    originalName: {
        type: String,
        required: true
    },
    storedName: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        required: true
    },
    mimeType: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    extractionMethod: {
        type: String,
        enum: ['tika', 'ocr', 'none'],
        default: 'none'
    },
    extractedText: {
        type: String,
        default: ''
    },
    metadata: {
        type: Object,
        default: {}
    },
    status: {
        type: String,
        enum: ['uploaded', 'processing', 'completed', 'failed'],
        default: 'uploaded'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Document', documentSchema);
