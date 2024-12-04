import express from 'express';
import { ObjectId } from 'mongodb';
import connectMongo from '../utils/connect-mongo.js';

const router = express.Router();

// updateTournament endpoint
router.post('/updateTournament', async(req, res) => {

    // mongodb connection
    const {u_collection, t_collection, client} = await connectMongo('both');

    console.log(client);
    console.log(u_collection);
    
    const {tournamentID, name, size, participants, format, sport, start, end, status} = req.body;

    const inputTournament = {
        tournamentID: tournamentID,
        name: name,
        size: size,
        participants: participants,
        format: format,
        sport: sport,
        start: start,
        end: end,
        status: status
    }

    try{

        // create updatedTournament object with same values as inputTournament except tournamentID so object id is not changed
        const { tournamentID, ...updatedTournament } = inputTournament;

        const tournament = await collection.findOne({name: name});

        if(tournament){
            res.status(409).json({error: "Tournament with this name already exists"});
        }
        else{
            await t_collection.updateOne( {_id: ObjectId.createFromHexString(tournamentID)}, {$set: updatedTournament} );
            res.status(200).json({message: "Tournament updated successfully"});
        }
    }
    catch(error){
        console.log("Error updating tournament: ", error);
        res.status(401).json({error: "Error updating tournament"});
    }
    finally{
        await client.close();
        console.log("MongoDB connection closed");
    }
});

export default router;
