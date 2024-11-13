import express from 'express';
import connectMongo from '../utils/connect-mongo.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

router.post('/readTournament', async (req, res) => {
    const { id } = req.body;
    const { collection, client } = await connectMongo('tournaments');
    
    //basic search and return 
    try 
    {
        let tournament = await collection.findOne({
            _id: ObjectId.createFromHexString(id),
        });
        if(tournament)
            res.status(200).json({
            tournament: tournament,
            error: ''
            });
        else
            res.status(404).json({ error: 'Tournament does not exist.'});
    }
    catch (error) {
        res.status(500).json({ error: 'Server error, Please try again later.' });
    }
    finally
    {
        client.close();
    }
})

export default router;