import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
dotenv.config();

const connectMongo = async (collectionName) => {
    const url = process.env.MONGO_URI;
    const client = new MongoClient(url);

    try {
        await client.connect();  
        const db = client.db(process.env.DATABASE_NAME);
        
        let collection;
        if (collectionName === 'tournaments')
            collection = db.collection(process.env.TOURNAMENT_COLLECTION);
        else if (collectionName === 'users')
            collection = db.collection(process.env.USER_COLLECTION);
        
        return { collection, client };
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    } 
};

export default connectMongo;