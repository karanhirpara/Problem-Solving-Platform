import mongoose, { Document, Schema } from 'mongoose';

 
export const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${'mongodb+srv://karankhirapara:karan12500@cluster0.usdq7.mongodb.net'}`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }
}
