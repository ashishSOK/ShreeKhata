import mongoose from 'mongoose';

async function fixOldTransactions() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/shreekhata');
        const db = mongoose.connection.db;

        // Find the primary user (the owner)
        const user = await db.collection('users').findOne({});
        if (!user) throw new Error('No user found');
        const userId = user._id;

        const txns = await db.collection('transactions').find({}).toArray();
        let updatedCount = 0;

        for (const t of txns) {
            let needsUpdate = false;
            let updateObj = {};
            if (!t.addedBy) {
                updateObj.addedBy = t.user || userId;
                needsUpdate = true;
            }
            if (!t.user) {
                updateObj.user = userId;
                needsUpdate = true;
            }

            if (needsUpdate) {
                await db.collection('transactions').updateOne(
                    { _id: t._id },
                    { $set: updateObj }
                );
                updatedCount++;
            }
        }
        console.log(`Successfully migrated ${updatedCount} transactions`);
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}

fixOldTransactions();
