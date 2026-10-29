const fs = require('fs');
const path = require('path');

class StorageService {
    constructor() {
        this.provider = process.env.STORAGE_PROVIDER || 'local';
    }

    async saveFile(file) {
        if (this.provider === 'local') {
            // Handled by multer currently, but if we need to move files around:
            return file.path;
        }
        // Cloudinary/S3 implementation goes here later
        throw new Error('Unsupported storage provider');
    }

    async getFile(filePath) {
        if (this.provider === 'local') {
            return fs.createReadStream(filePath);
        }
        throw new Error('Unsupported storage provider');
    }

    async deleteFile(filePath) {
        if (this.provider === 'local') {
            return new Promise((resolve, reject) => {
                fs.unlink(filePath, (err) => {
                    if (err) return reject(err);
                    resolve(true);
                });
            });
        }
        throw new Error('Unsupported storage provider');
    }
}

module.exports = new StorageService();
