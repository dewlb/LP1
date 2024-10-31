import sendVerificationEmail from "./emailService";
import {MongoClient, ObjectId} from "mongodb";
import jwt from 'jsonwebtoken';


//Update this with correct MongoDB URI
const URL = '';
const DATABASE = '';
const USERS = '';

const client = new MongoClient(URL);

const signup = async (req, res) => {
    try{
        const { email, password } = req.body;

        // Connect to database if not already connected
        if (!client.isConnected()) {
            await client.connect();
        }

        // Access the correct database & collection
        const database = client.db(DATABASE)
        const users = database.collection(USERS);

        // Check if user already exists
        const existingUser = await users.findOne({ email });
        if (existingUser) return res.status(400).json({ error: 'User already exists' });

        // Create user in database
        const newUser = {
            email,
            password,
            isVerified: false
        };

        
        const result = await users.insertOne(newUser);

        // Create a verification token
        const token = jwt.sign({ userId: result.insertedId }, process.env.JWT_SECRET, { expiresIn: '1h'});

        // Send verification email
        await sendVerificationEmail(newUser.email, token);

        res.status(201).json({ message: 'User registered. Please check your email to verify your account.' });
    }
    catch(error){
        res.status(500).json({ error: 'Error registering user' });
    }
    finally{
        await client.close();
    }
};

const verifyEmail = async (req, res) => {
    try{
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Connect to database if not already connected
        if (!client.isConnected()) {
            await client.connect();
        }

        // Access correct database and collection
        const database = client.db(DATABASE);
        const users = database.collection(USERS);

        // Find user by the decoded token's userId
        const user = await users.findOne({ _id: new ObjectId(decoded.userId) });
        if (!user) return res.status(400).json({ error: 'Invalid token' });

        //Update the user's isVerified field to true
        await users.updateOne({ _id: user._id}, { $set: {isVerified: true} });

        res.json({ message: 'Email successfully verified' });
    }
    catch(error){
        res.status(500).json({ error: 'Error verifiying email' });
    }
    finally{
        await client.close();
    }
};

export { signup, verifyEmail};
