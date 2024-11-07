import express from 'express';
import { MongoClient } from 'mongodb';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import sendMail from '../utils/sendMail.js';

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
dotenv.config();

const router = express.Router();

// set up MongoDB connection
const url = process.env.MONGO_URI;
const db_name = process.env.DATABASE_NAME;
const collection_name = process.env.USER_COLLECTION;

const client = new MongoClient(url);
await client.connect();
const db = client.db(db_name);
const userCollection = db.collection(collection_name);

// login endpoint
router.post('/login', async(req, res) => {
    const {username, password} = req.body;

    try{
        const user = await userCollection.findOne({username, password});
        if(user){
            //if user isnt verified, resend verification email
            if(user.verified === false){
                res.status(202).json({message: "User not verified"});
                await sendMail(
                    user.email,
                    'Verify Your Email',
                    `Click the following link to verify your email: ${process.env.FRONTEND_URL}/api/verify/${user.token}`
                );
            }
            else{
                res.status(200).json({message: "Login successful", info: user});
            }
        }
        else{
            res.status(401).json({message: "Invalid username or password"});
        }
    }catch(error){
        console.error("Error logging in:", error);
        res.status(500).json({message: "Internal server error"});
    }

});

export default router;
