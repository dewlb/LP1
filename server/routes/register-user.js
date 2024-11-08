import express from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import sendMail from '../utils/send-mail.js';
import crypto from 'crypto';
import connectMongo from '../utils/connect-mongo.js';

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const router = express.Router(); 

//generate token for email veri
const generateVerificationToken = () => {
    return crypto.randomBytes(32).toString('hex');
  };

//function to add user, defaults to unverified
const addUser = async (collection, firstName, lastName, email, username, password) => {
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

    return await collection.insertOne(newUser);
}

router.post('/register', async (req, res) => {
    const {firstName, lastName, email, username, password} = req.body;
    const { collection, client } = await connectMongo('users');
    try
    {
        //find user and see if email or login is already taken
        const user = await collection.findOne({
            $or: [
                { email: req.body.email },
                { username: req.body.username }
            ]
        });
        if(user)
        {
            console.log('User with email or login already exists');
            res.status(409).json({
                message: 'User with email or login already exists'
            });            
        } 
        else
        {
            //adds user to database and sends email
            const result = await addUser(collection, firstName, lastName, email, username, password);
            console.log(result);
            res.status(200).json({message: 'Success, Email has been sent for verification.'});
        }
    } 
    catch(error) 
    {
        res.status(500).json({ message: 'Cannot connect to database' });
        console.log('Error connecting to database:', error);
    }
    finally
    {
        client.close();
    }
});

//token is used for verification 
router.get('/verify/:token', async (req, res) => {
    const { collection, client } = await connectMongo('users');
    try 
    {
        const { token } = req.params;
        await verifyEmail(collection, token);
        res.status(200).json({ message: 'Email verified successfully' });
    } 
    catch (error) 
    {
        res.status(400).json({ error: error.message });
    }
    finally
    {
        client.close();
    }
});

const verifyEmail = async (collection, token) => {
    let user = await collection.findOne({
        token: token,
    });
  
    if (!user) 
    {
        throw new Error('Invalid or expired verification token');
    }
    else
    {
        await collection.updateOne(
            { _id: user._id }, 
            {
                $set: {verified: true},
                $unset: {token: ""}
            }
        );
    }
};


export default router;