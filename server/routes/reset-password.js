import express from 'express';
import sendMail from '../utils/send-mail.js';
import connectMongo from '../utils/connect-mongo.js';

const router = express.Router();


router.post('/reset', async(req, res) => {
    const { email } = req.body;
    const { collection, client } = await connectMongo('users');

    try{
        const user = await collection.findOne({email: email});

        if(user){
            await sendMail(
                email,
                'Password',
                `Your password for gameplan is ${user.password}`
            );
            res.status(200).json({message: "Success, sending email now"})
        }
        else {
            res.status(401).json({error: "Email doesn't exist"});
        }
    }
    catch(error){
        console.message("Error connecting to db", error);
        res.status(401).json({error: "Error connecting to Server"});
    }
    finally{
        await client.close();
        console.log("MongoDB connection closed");
    }
});

export default router;