import mongoose from 'mongoose';

const uri = 'mongodb://localhost:27017/budgetTracker';

async function connectToDatabase() {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB using Mongoose!');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1)
    }
}

export default connectToDatabase;