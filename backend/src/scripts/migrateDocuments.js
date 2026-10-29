/**
 * Migration Script: Assign orphan documents to a default/admin user
 * Run via: node src/scripts/migrateDocuments.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Document = require('../models/Document');
const User = require('../models/User');

const migrate = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB.');

        // Find documents without userId
        const orphanDocs = await Document.find({
            $or: [
                { userId: { $exists: false } },
                { userId: null }
            ]
        });

        console.log(`Found ${orphanDocs.length} orphan document(s).`);

        if (orphanDocs.length === 0) {
            console.log('No migration needed.');
            process.exit(0);
        }

        // Find or create default legacy user
        let defaultUser = await User.findOne({ email: 'legacy-admin@transformodocs.local' });
        if (!defaultUser) {
            defaultUser = await User.create({
                name: 'Legacy Admin',
                email: 'legacy-admin@transformodocs.local',
                passwordHash: 'LegacyAdminPass@123',
                authProvider: 'local',
                emailVerified: true
            });
            console.log('Created default legacy user: legacy-admin@transformodocs.local');
        }

        const updateResult = await Document.updateMany(
            {
                $or: [
                    { userId: { $exists: false } },
                    { userId: null }
                ]
            },
            { $set: { userId: defaultUser._id } }
        );

        console.log(`Migrated ${updateResult.modifiedCount} document(s) to user: ${defaultUser.email}`);
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
};

migrate();
