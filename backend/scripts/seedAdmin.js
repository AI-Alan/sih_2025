// backend/scripts/seedAdmin.js
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from '../models/admin.js';

dotenv.config();

async function run() {
    try {
        // Use the same env var your app uses (see backend/utils/db.js)
        const MONGO_URI =
            process.env.ATLASDB_URL ||
            process.env.MONGODB_URI ||
            process.env.DB_URL ||
            'mongodb://127.0.0.1:27017/mann-mitra';

        console.log('Connecting to MongoDB:', MONGO_URI ? 'OK (URI present)' : 'No URI, using localhost fallback');
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const email = 'admin@example.com';
        const plainPassword = 'admin@123';

        const existing = await Admin.findOne({ email });
        if (existing) {
            console.log('Admin already exists:', existing.email);
            process.exit(0);
        }

        const hash = await bcrypt.hash(plainPassword, 10);
        const admin = new Admin({
            firstName: 'Super',
            lastName: 'Admin',
            email,
            password: hash,
            role: 'admin',
        });
        await admin.save();
        console.log('Seeded admin:', email, 'with password:', plainPassword);
        process.exit(0);
    } catch (e) {
        console.error('Seeding failed:', e);
        process.exit(1);
    }
}

run();