import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.TASKS_DB_URI, {
            dbName:process.env.TASKS_DB_NAME,
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        console.log("\n\t -> Connected to the database")        
    } catch (err) {
        console.error(err);
    }
}

export default connectDB