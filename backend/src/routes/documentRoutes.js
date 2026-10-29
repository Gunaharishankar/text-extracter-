const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const uploadMiddleware = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

// All document management routes require authentication
router.use(protect);

router.post('/upload', uploadMiddleware.single('document'), documentController.uploadDocument);
router.get('/', documentController.getDocuments);
router.get('/:id', documentController.getDocument);
router.get('/:id/text', documentController.getDocumentText);
router.delete('/:id', documentController.deleteDocument);

module.exports = router;
