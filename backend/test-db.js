import mongoose from 'mongoose';

async function checkOldTransactions() {
    await mongoose.connect('mongodb://127.0.0.1:27017/shreekhata');
    const db = mongoose.connection.db;

    // We use raw db query to bypass mongoose schema
    const txns = await db.collection('transactions').find({}).toArray();
    let invalidCount = 0;

    for (const t of txns) {
        if (!t.addedBy || !t.user) {
            console.log(`Transaction ${t._id} missing addedBy or user`);
            invalidCount++;
        }
    }

    console.log(`Found ${invalidCount} invalid transactions out of ${txns.length}`);
    process.exit(0);
}

checkOldTransactions().catch(console.error);
