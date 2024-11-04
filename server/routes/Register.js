import express from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import sendMail from '../utils/sendMail.js';
import crypto from 'crypto';

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const router = express.Router();

//connect to database
const url = process.env.MONGO_URI;
const client = new MongoClient(url);
client.connect();
const db = client.db(process.env.DATABASE_NAME); 
const userCollection = db.collection(process.env.COLLECTION); 

//generate token for email veri
const generateVerificationToken = () => {
    return crypto.randomBytes(32).toString('hex');
  };

//function to add user, defaults to unverified
const addUser = async (firstName, lastName, email, username, password) => {
    const token = generateVerificationToken();

    const newUser = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        username: username,
        password: password,
        verified: false,
        token: token,
        dateCreated: new Date()
    };

    //send email and then add to collection unverified
    await sendMail(
        email,
        'Verify Your Email',
        `Click the following link to verify your email: ${process.env.FRONTEND_URL}/api/verify/${token}`
    );

    return await userCollection.insertOne(newUser);
}

router.post('/register', async (req, res) => {
    const {firstName, lastName, email, username, password} = req.body;

    try
    {
        //find user and see if email or login is already taken
        const user = await userCollection.findOne({
            $or: [
                { email: req.body.email },
                { username: req.body.username }
            ]
        });
        if(user)
        {
            console.log('User with email or login already exists');
            res.send(JSON.stringify({
                message: 'User with email or login already exists'
            }));
        } 
        else
        {
            const result = await addUser(firstName, lastName, email, username, password);
            console.log(result);
            res.send(JSON.stringify({
                message: 'Success, Email has been sent for verification.'
            }));
        }
    } 
    catch(error) 
    {
        res.send(JSON.stringify({
            message: 'cannot connect to database'
        }));
        console.log('Error connecting to database:', error);
    }
});

router.get('/verify/:token', async (req, res) => {
    try 
    {
      const { token } = req.params;
      await verifyEmail(token);
      res.status(200).json({ message: 'Email verified successfully' });
    } 
    catch (error) 
    {
      res.status(400).json({ error: error.message });
    }
});

const verifyEmail = async (token) => {
    let user = await userCollection.findOne({
      token: token,
    });
  
    if (!user) 
    {
      throw new Error('Invalid or expired verification token');
    }
  
    await userCollection.updateOne(
        { _id: user._id }, 
        { $set: {verified: true} } 
    );

    user = await userCollection.findOne({
        token: token,
    });

    console.log(user);
  
    return user;
};


export default router;