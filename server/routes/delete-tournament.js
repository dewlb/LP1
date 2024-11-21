import express from 'express';
import { ObjectId } from 'mongodb';
import connectMongo from '../utils/connect-mongo.js';

const router = express.Router();

// deleteTournament endpoint
router.post('/deleteTournament', async(req, res) => {

    // mongodb connection
    const {collection, client} = await connectMongo('tournaments');

    const {tournamentID} = req.body;
    console.log(tournamentID);

    try{
        // search by object id
        const tournament = await collection.findOne({_id: ObjectId.createFromHexString(tournamentID)});

        if(tournament){
            await collection.deleteOne(tournament);
            res.status(200).json({message: "Tournament succesfully deleted"});
        }
        else{
            res.status(409).json({error: "No such tournament found"});
        }
    }
    catch(error){
        console.log("Error deleting tournament: ", error);
        res.status(401).json({error: "Error deleting tournament"});
    }
    finally{
        await client.close();
        console.log("MongoDB connection closed");
    }
});

export default router;
