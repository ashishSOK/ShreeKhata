import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

import User from './models/User.js';

const migrate = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        // Update all users where role is not set
        const result = await User.updateMany(
            { role: { $exists: false } }, // Or we can just set it for everyone who doesn't have it
            { $set: { role: 'owner' } }
        );

        // Also just to be safe, update any that might be null or something else invalid if applicable
        const result2 = await User.updateMany(
            { role: null },
            { $set: { role: 'owner' } }
        );

        console.log(`Updated ${result.modifiedCount + result2.modifiedCount} users to be owners.`);

        // Let's also make sure we update those who might have an empty string or something
        const result3 = await User.updateMany(
            { role: { $nin: ['owner', 'member'] } },
            { $set: { role: 'owner' } }
        );
        console.log(`Fixed ${result3.modifiedCount} users with invalid roles.`);

        console.log('Migration complete');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrate();
