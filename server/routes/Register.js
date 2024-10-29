import express from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const router = express.Router();

const url = process.env.MONGO_URI;
const client = new MongoClient(url);
client.connect();
const db = client.db('data'); 
const userCollection = db.collection('users'); 

router.post('/register', async (req, res) => {
    const {firstName, lastName, email, username, password} = req.body;
    const newUser = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        username: username,
        password: password,
        dateCreated: new Date()
    };

    try
    {
        const user = await userCollection.findOne({
            $or: [
                { email: req.body.email },
                { username: req.body.username }
            ]
        });
        if(user)
        {
            console.log('user already exists');
            res.send(JSON.stringify({
                message: 'user already exists'
            }));
        } 
        else
        {
            const result = await userCollection.insertOne(newUser);
            res.send(JSON.stringify({
                message: 'success'
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


export default router;